const fs = require('fs');
const execSync = require('child_process').execSync;

const jsonStr = execSync('node generateModels.js').toString().trim();

const data = fs.readFileSync('lib/mockData.ts', 'utf8');
const startIdx = data.indexOf('export const MOCK_IPHONE_MODELS');
const endIdx = data.indexOf('export interface Store');

const newCode = data.slice(0, startIdx) + 'export const MOCK_IPHONE_MODELS: IphoneModel[] = ' + jsonStr + ';\n\n' + data.slice(endIdx);
fs.writeFileSync('lib/mockData.ts', newCode);
console.log('Updated mockData.ts');
