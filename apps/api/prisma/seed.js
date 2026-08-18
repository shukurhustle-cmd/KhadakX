require('dotenv/config');

async function main() {
  // The production database is intentionally created by Prisma migrations.
  // Business data is created through the application onboarding flow.
  console.log('KhadakX database seed: no static seed records required.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
