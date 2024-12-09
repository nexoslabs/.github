import fs from 'fs-extra';
import path from 'path';
import { CONFIG } from './constants.js';

export const thousands = (number) => number.toLocaleString();

export const jsonStringify = (data) => JSON.stringify(data, null, 2);

export const writeFileToOutput = (fileName, fileData) => {
    fs.writeFileSync(path.resolve(CONFIG.OUTPUT_DIR, fileName), fileData);
};

export const writeJSONToOutput = (fileName, jsonData) => {
    writeFileToOutput(fileName, jsonStringify(jsonData));
};
