#!/usr/bin/env node
/**
 * Downloads and unpacks the tracked Camunda Modeler release.
 *
 * Kept out of the specs on purpose: a 150 MB download inside a test would blur
 * an infrastructure problem into a test failure. CI runs this as its own step,
 * and `plugin.spec.mjs` skips itself when the binary is absent.
 */

import { modelerBinary, CACHE } from './modeler.mjs';

const binary = modelerBinary({ download: true });

console.log(`Camunda Modeler ready:\n  ${binary}\n  cache: ${CACHE}`);
