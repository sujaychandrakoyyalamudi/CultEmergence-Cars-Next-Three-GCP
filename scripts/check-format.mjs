#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const extensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.md', '.css', '.yaml', '.yml', '.tf']);
const ignored = new Set(['.git', '.next', 'node_modules', 'coverage', 'playwright-report', 'test-results', '.terraform']);
const errors = [];

function walk(directory) {
  for (const name of readdirSync(directory)) {
    if (ignored.has(name)) continue;
    const path = join(directory, name);
    const stat = statSync(path);
    if (stat.isDirectory()) walk(path);
    else if (extensions.has(extname(path))) check(path);
  }
}

function check(path) {
  const content = readFileSync(path, 'utf8');
  const label = relative(root, path);
  if (content.includes('\r')) errors.push(`${label}: CRLF line endings`);
  if (!content.endsWith('\n')) errors.push(`${label}: missing final newline`);
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    if (/\s+$/.test(line)) errors.push(`${label}:${index + 1}: trailing whitespace`);
    if (line.includes('\t')) errors.push(`${label}:${index + 1}: tab character`);
  });
  if (extname(path) === '.json') {
    try {
      const parsed = JSON.parse(content);
      const normalized = `${JSON.stringify(parsed, null, 2)}\n`;
      if (content !== normalized) errors.push(`${label}: JSON is not normalized to two-space indentation`);
    } catch (error) {
      errors.push(`${label}: invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

walk(root);
if (errors.length > 0) {
  console.error('Formatting hygiene check FAIL');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Formatting hygiene check PASS.');
