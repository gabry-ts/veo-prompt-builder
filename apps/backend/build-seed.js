const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Compile seed.ts to seed.js
console.log('Compiling seed.ts...');
execSync(
  'npx tsc prisma/seed.ts --outDir prisma --module commonjs --esModuleInterop --skipLibCheck',
  {
    stdio: 'inherit',
  },
);

console.log('Seed compiled successfully!');
