import path from 'node:path';

export const PLUGIN_ROOT = path.resolve(import.meta.dirname, '..', '..');
export const WORKSPACE_ROOT = path.resolve(PLUGIN_ROOT, '..', '..');

const FIXTURES = path.join(PLUGIN_ROOT, 'test', 'fixtures');

export const IGNORE_FILE = path.join(FIXTURES, 'upstream-ignore.json');
export const RUNTIME_KEYS_FILE = path.join(FIXTURES, 'known-runtime-keys.json');
export const BASELINE_FILE = path.join(FIXTURES, 'translation-baseline.json');

export const PUBLISHED_FIXTURE = path.join(FIXTURES, 'upstream', 'bpmn-js.translations.json');
export const HARVESTED_FIXTURE = path.join(FIXTURES, 'upstream', 'harvested.json');
export const APP_SHELL_FIXTURE = path.join(FIXTURES, 'upstream', 'app-shell.keys.json');

export const COVERAGE_FILE = path.join(PLUGIN_ROOT, 'docs', 'COVERAGE.md');
