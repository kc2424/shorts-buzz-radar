import fs from "node:fs";
import path from "node:path";

const configPath = path.join(
  process.env.APPDATA ?? "",
  "xdg.config",
  ".wrangler",
  "config",
  "default.toml",
);

const toml = fs.readFileSync(configPath, "utf8");
const match = toml.match(/oauth_token\s*=\s*"([^"]+)"/);

if (!match) {
  console.error("OAuth token not found in wrangler config");
  process.exit(1);
}

const token = match[1];
const accountId = "6a1c26f4f8db3df8d5647d6e4f1ccf00";
const subdomain = process.argv[2] ?? "kc2424-buzz";

const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subdomain }),
  },
);

const data = await response.json();
console.log(JSON.stringify(data, null, 2));

if (!data.success) {
  process.exit(1);
}
