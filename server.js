const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Static files
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use('/audio', express.static(path.join(__dirname, 'public/audio')));
app.use(express.static(path.join(__dirname, 'public')));

// Root → verify page
app.get('/', (req, res) => {
  res.redirect('/pages/verify.html');
});

// ─── In-memory circle store ───────────────────────────────────────────────────

const circleStore = {};

(function initCircleStore() {
  const users = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf-8')
  );
  for (const user of users) {
    circleStore[user.id] = user.trusted_circle.map((entry) =>
      typeof entry === 'string' ? { phone: entry, name: '' } : entry
    );
  }
})();

// ─── In-memory history & notifications ───────────────────────────────────────

const verifyHistory = [];

function logHistory(entry) {
  verifyHistory.unshift(entry);
  if (verifyHistory.length > 100) verifyHistory.pop();
}

// ─── POST /api/verify ─────────────────────────────────────────────────────────

app.post('/api/verify', (req, res) => {
  try {
    const { phone, agentCode } = req.body;
    if (!phone && !agentCode) {
      return res.status(400).json({ error: 'phone or agentCode required' });
    }

    const agents = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/agents.json'), 'utf-8')
    );

    const agent = agents.find(
      (a) =>
        (phone && a.phone === phone) ||
        (agentCode && a.id === agentCode)
    );

    if (!agent) {
      logHistory({ query: phone || agentCode, badge: 'red', agentName: null, region: null, timestamp: new Date().toISOString() });
      return res.json({
        found: false,
        badge: 'red',
        message: 'Not in verified agent registry',
      });
    }

    if (agent.verified) {
      logHistory({ query: phone || agentCode, badge: 'green', agentName: agent.name, region: agent.region, timestamp: new Date().toISOString() });
      return res.json({
        found: true,
        badge: 'green',
        agent: {
          id: agent.id,
          name: agent.name,
          region: agent.region,
          kebele: agent.kebele,
          trust_score: agent.trust_score,
        },
      });
    }

    logHistory({ query: phone || agentCode, badge: 'yellow', agentName: agent.name, region: agent.region, timestamp: new Date().toISOString() });
    return res.json({
      found: true,
      badge: 'yellow',
      agent: {
        id: agent.id,
        name: agent.name,
        region: agent.region,
        trust_score: agent.trust_score,
      },
      warning: 'Low trust score',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST /api/check-message ──────────────────────────────────────────────────

app.post('/api/check-message', (req, res) => {
  try {
    const { text, language = 'en' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'text required' });
    }

    const patterns = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data/patterns.json'), 'utf-8')
    );

    const normalized = text.toLowerCase();

    const flagged = patterns.filter((pattern) => {
      const keywords = pattern.keywords[language] ?? pattern.keywords['en'] ?? [];
      const matches = keywords.filter((kw) => normalized.includes(kw.toLowerCase()));
      return matches.length >= 2;
    });

    const riskScore = Math.min(flagged.length, 3);
    const level = riskScore === 0 ? 'safe' : riskScore === 1 ? 'caution' : 'block';

    return res.json({
      riskScore,
      level,
      flags: flagged.map((p) => ({
        type: p.type,
        description: p.description[language] ?? p.description['en'],
        severity: p.severity,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET /api/circle/:userId ──────────────────────────────────────────────────

app.get('/api/circle/:userId', (req, res) => {
  const contacts = circleStore[req.params.userId] ?? [];
  res.json({ contacts });
});

// ─── POST /api/circle/:userId ─────────────────────────────────────────────────

app.post('/api/circle/:userId', (req, res) => {
  const { userId } = req.params;
  const { phone, name } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'phone required' });
  }

  const contacts = circleStore[userId] ?? [];

  if (contacts.length >= 10) {
    return res.status(400).json({ error: 'Circle is full (max 10)' });
  }
  if (contacts.some((c) => c.phone === phone)) {
    return res.status(400).json({ error: 'Already in circle' });
  }

  const updated = [...contacts, { phone, name: name ?? '' }];
  circleStore[userId] = updated;
  res.json({ success: true, contacts: updated });
});

// ─── DELETE /api/circle/:userId/:phone ────────────────────────────────────────

app.delete('/api/circle/:userId/:phone', (req, res) => {
  const { userId, phone } = req.params;
  const contacts = circleStore[userId] ?? [];
  const updated = contacts.filter((c) => c.phone !== phone);
  circleStore[userId] = updated;
  res.json({ success: true, contacts: updated });
});

// ─── GET /api/history ─────────────────────────────────────────────────────────

app.get('/api/history', (req, res) => {
  res.json({ history: verifyHistory });
});

// ─── DELETE /api/history/clear ────────────────────────────────────────────────

app.delete('/api/history/clear', (req, res) => {
  verifyHistory.length = 0;
  res.json({ success: true });
});

// ─── GET /api/notifications ───────────────────────────────────────────────────

app.get('/api/notifications', (req, res) => {
  const alerts = verifyHistory
    .filter((e) => e.badge === 'yellow' || e.badge === 'red')
    .slice(0, 20)
    .map((e) => ({
      ...e,
      message:
        e.badge === 'red'
          ? `⚠️ Unregistered number checked: ${e.query}`
          : `⚡ Low-trust agent checked: ${e.agentName || e.query}`,
    }));
  res.json({ notifications: alerts });
});

// ─── GET /api/search ──────────────────────────────────────────────────────────

app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  if (!q) return res.json({ results: [] });

  const agents = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data/agents.json'), 'utf-8')
  );

  const results = agents
    .filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.region.toLowerCase().includes(q) ||
      (a.kebele && a.kebele.toLowerCase().includes(q)) ||
      a.id.toLowerCase().includes(q) ||
      a.phone.includes(q)
    )
    .slice(0, 10)
    .map((a) => ({
      id: a.id,
      name: a.name,
      phone: a.phone,
      region: a.region,
      kebele: a.kebele,
      trust_score: a.trust_score,
      verified: a.verified,
    }));

  res.json({ results });
});

// ─── GET /api/profile/:userId ─────────────────────────────────────────────────

app.get('/api/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const users = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf-8')
  );
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const circle = circleStore[userId] ?? [];
  const userHistory = verifyHistory.filter((e) => e.userId === userId);

  res.json({
    id: user.id,
    name: user.name,
    language: user.language,
    circleCount: circle.length,
    verifyCount: verifyHistory.length,
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`TrustLayer running at http://localhost:${PORT}`);
});
