const fs = require('fs');
const path = require('path');

const newPrices = `900
1000
1100
1000
1200
1300
1200
1300
1400
1100
1200
1300
1000
1100
1200
1400
1500
1600
1700
1800
1900
1400
1500
1600
1000
1100
1200
1700
1800
1900
2000
2100
2300
2500
2700
1500
1600
1700
1700
1800
1900
2200
2300
2400
2500
2500
2600
2700
2800
2200
2300
2400
2500
2600
2700
2700
2800
2900
3000
3500
3700
3900
2900
3000
3100
2000
2100
2200
3100
3200
3300
3400
3500
3600
3700
4000
4100
4200
4300
4000
4100
4200
4300
4400
4500
4700
4800
4900
5500
5600
5700
5800`.split('\n').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

const mockDataPath = path.join(__dirname, '..', 'lib', 'mockData.ts');
let content = fs.readFileSync(mockDataPath, 'utf8');

// Extrair MOCK_IPHONE_MODELS
const match = content.match(/export const MOCK_IPHONE_MODELS: IphoneModel\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not find MOCK_IPHONE_MODELS');
  process.exit(1);
}

let models = eval(match[1]);

// Funções de sort iguais ao do frontend
const getTier = (modelo) => {
    const m = modelo.toLowerCase();
    if (m.includes('pro max')) return 4;
    if (m.includes('pro')) return 3;
    if (m.includes('plus') || m.includes('air')) return 2;
    if (m.includes('mini') || m.includes('se')) return 0;
    return 1; // base
};
const parseStorage = (s) => {
    if (s.toUpperCase().includes('TB')) return parseInt(s) * 1024;
    return parseInt(s) || 0;
};

models.sort((a, b) => {
    const anoA = a.ano || 2024;
    const anoB = b.ano || 2024;
    if (anoA !== anoB) return anoA - anoB; // older first
    const tierA = getTier(a.modelo);
    const tierB = getTier(b.modelo);
    if (tierA !== tierB) return tierA - tierB;
    return parseStorage(a.armazenamento) - parseStorage(b.armazenamento);
});

console.log(`Temos ${models.length} modelos e ${newPrices.length} preços.`);

models.forEach((m, i) => {
    m.valor_base_upgrade = newPrices[i] || 0;
});

const newModelsString = JSON.stringify(models, null, 2);
const newContent = content.replace(/export const MOCK_IPHONE_MODELS: IphoneModel\[\] = \[[\s\S]*?\];/, `export const MOCK_IPHONE_MODELS: IphoneModel[] = ${newModelsString};`);

fs.writeFileSync(mockDataPath, newContent, 'utf8');
console.log('Done!');
