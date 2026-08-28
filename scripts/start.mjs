#!/usr/bin/env node
import { spawn } from 'node:child_process';

const port = process.env.PORT ?? '8080';
const command = process.platform === 'win32' ? 'next.cmd' : 'next';
const child = spawn(command, ['start', '--hostname', '0.0.0.0', '--port', port], {
  stdio: 'inherit',
  env: process.env
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
