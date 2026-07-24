import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: pnpm admin:hash "your-new-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log("\nPaste this into ADMIN_PASSWORD_HASH in .env and in your Vercel project env vars:\n");
console.log(hash);
console.log("\nThen restart the dev server (and redeploy on Vercel) for it to take effect.\n");
