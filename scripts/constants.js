import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJSONPath = path.resolve(__dirname, '..', 'package.json');

let packageJSON = {};
try {
  packageJSON = fs.readJSONSync(packageJSONPath);
  console.info(`[INFO] ${new Date().toISOString()} - Loaded package.json successfully.`);
} catch (error) {
  console.error(`[ERROR] ${new Date().toISOString()} - Failed to read package.json: ${error.message}`);
}

export const CONFIG = {
  NPM_UID: process.env.NPM_UID || packageJSON.config?.npmUID || 'nexoscreator',
  GITHUB_UID: process.env.GITHUB_UID || packageJSON.config?.githubUID || 'nexoscreator',
  OUTPUT_DIR: path.resolve(__dirname, '..', 'output')
};

export const GITHUB_ACCESS_TOKEN = process.env.PAT_TOKEN || '';

if (!GITHUB_ACCESS_TOKEN) {
  console.warn(`[WARNING] ${new Date().toISOString()} - GitHub PAT token is missing! Some features may not work.`);
}

fs.ensureDirSync(CONFIG.OUTPUT_DIR);
console.info(`[INFO] ${new Date().toISOString()} - Output directory ensured: ${CONFIG.OUTPUT_DIR}`);
