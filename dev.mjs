import { spawn } from 'node:child_process';

const children = [
  spawn(process.execPath, ['--watch', 'src/index.js'], { cwd: 'backend', stdio: 'inherit' }),
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], { cwd: 'frontend', stdio: 'inherit' }),
];

const stop = () => children.forEach((child) => child.kill());
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
