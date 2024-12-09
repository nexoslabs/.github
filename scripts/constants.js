import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJSON = fs.readJSONSync(path.resolve(__dirname, '..', 'package.json'));

export const CONFIG = {
    NPM_UID: process.env.NPM_UID || packageJSON.config?.npmUID || 'default-npm-user',
    GITHUB_UID: process.env.GITHUB_UID || packageJSON.config?.githubUID || 'default-github-user',
    OUTPUT_DIR: path.resolve(__dirname, '..', 'output')
};

export const GITHUB_ACCESS_TOKEN = process.env.PAT_TOKEN;

fs.ensureDirSync(CONFIG.OUTPUT_DIR);
