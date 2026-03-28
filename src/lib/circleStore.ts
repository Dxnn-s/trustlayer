import fs from "fs";
import path from "path";

export interface Contact {
  phone: string;
  name: string;
}

// Module-level store — persists across requests, resets on server restart
const store = new Map<string, Contact[]>();
let initialized = false;

export function getCircle(userId: string): Contact[] {
  init();
  return store.get(userId) ?? [];
}

export function setCircle(userId: string, contacts: Contact[]): void {
  store.set(userId, contacts);
}

function init() {
  if (initialized) return;
  initialized = true;

  const filePath = path.join(process.cwd(), "data", "users.json");
  const users = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Array<{
    id: string;
    trusted_circle: Array<string | Contact>;
  }>;

  for (const user of users) {
    const contacts: Contact[] = user.trusted_circle.map((entry) =>
      typeof entry === "string" ? { phone: entry, name: "" } : entry
    );
    store.set(user.id, contacts);
  }
}
