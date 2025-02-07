import fs from 'fs-extra';
import path from 'path';
import { CONFIG } from './constants.js';

export const thousands = (number) => number.toLocaleString();

export const jsonStringify = (data) => JSON.stringify(data, null, 2);

export const writeFileToOutput = (fileName, fileData) => {
  try {
    const filePath = path.resolve(CONFIG.OUTPUT_DIR, fileName);
    fs.writeFileSync(filePath, fileData);
    console.info(`[INFO] ${new Date().toISOString()} - File written successfully: ${filePath}`);
  } catch (error) {
    console.error(`[ERROR] ${new Date().toISOString()} - Failed to write file ${fileName}: ${error.message}`);
  }
};

export const writeJSONToOutput = (fileName, jsonData) => {
  try {
    writeFileToOutput(fileName, jsonStringify(jsonData));
  } catch (error) {
    console.error(`[ERROR] ${new Date().toISOString()} - Failed to write JSON file ${fileName}: ${error.message}`);
  }
};
