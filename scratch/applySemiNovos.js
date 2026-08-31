const fs = require('fs');
const path = require('path');

const newPrices = `1599
1699
1799
1999
2299
2399
2199
2499
2699
1799
1899
2299
1499
1699
1899
2299
2499
2699
2599
2799
2999`.split('\n').map(n => parseInt(n.trim())).filter(n => !isNaN(n));

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
    if (m.includes('pro max')) return 5;
    if (m.includes('pro')) return 4;
    if (m.includes('plus') || m.includes('air')) return 3;
    if (m.includes('mini') || m.includes(' e')) return 1;
    return 2; // base
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

// We want models from iPhone 11 up to iPhone 12 Pro Max 512GB
let targetModels = [];
for (let m of models) {
    if (m.modelo.includes('iPhone 11') || m.modelo.includes('iPhone 12')) {
        targetModels.push(m);
        // Stop at 12 Pro Max 512GB
        if (m.modelo === 'iPhone 12 Pro Max' && m.armazenamento === '512GB') {
            break;
        }
    }
}

console.log(`Encontrados ${targetModels.length} modelos alvo e ${newPrices.length} preços.`);

if (targetModels.length === newPrices.length) {
    targetModels.forEach((m, i) => {
        console.log(`${m.modelo} ${m.armazenamento}: ${newPrices[i]}`);
        m.preco_medio_usado = newPrices[i];
    });

    const newModelsString = JSON.stringify(models, null, 2);
    const newContent = content.replace(/export const MOCK_IPHONE_MODELS: IphoneModel\[\] = \[[\s\S]*?\];/, `export const MOCK_IPHONE_MODELS: IphoneModel[] = ${newModelsString};`);
    fs.writeFileSync(mockDataPath, newContent, 'utf8');
    console.log('Arquivo atualizado com sucesso!');
} else {
    console.error('Quantidade de preços não bate com a quantidade de modelos!');
}
