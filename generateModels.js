const fs = require('fs');

const raw = `IPHONE 11	64
IPHONE 11	128
IPHONE 11	256
IPHONE 11 PRO	64
IPHONE 11 PRO	256
IPHONE 11 PRO	512
IPHONE 11 PRO MAX	64
IPHONE 11 PRO MAX	256
IPHONE 11 PRO MAX	512
IPHONE 12	64
IPHONE 12	128
IPHONE 12	256
IPHONE 12 MINI	64
IPHONE 12 MINI	128
IPHONE 12 MINI	256
IPHONE 12 PRO	128
IPHONE 12 PRO	256
IPHONE 12 PRO	512
IPHONE 12 PRO MAX	128
IPHONE 12 PRO MAX	256
IPHONE 12 PRO MAX	512
IPHONE 13	128
IPHONE 13	256
IPHONE 13	512
IPHONE 13 MINI	128
IPHONE 13 MINI	256
IPHONE 13 MINI	512
IPHONE 13 PRO	128
IPHONE 13 PRO	256
IPHONE 13 PRO	512
IPHONE 13 PRO	1
IPHONE 13 PRO MAX	128
IPHONE 13 PRO MAX	256
IPHONE 13 PRO MAX	512
IPHONE 13 PRO MAX	1
IPHONE 14	128
IPHONE 14	256
IPHONE 14	512
IPHONE 14 PLUS	128
IPHONE 14 PLUS	256
IPHONE 14 PLUS	512
IPHONE 14 PRO	128
IPHONE 14 PRO	256
IPHONE 14 PRO	512
IPHONE 14 PRO	1
IPHONE 14 PRO MAX	128
IPHONE 14 PRO MAX	256
IPHONE 14 PRO MAX	512
IPHONE 14 PRO MAX	1
IPHONE 15	128
IPHONE 15	256
IPHONE 15	512
IPHONE 15 PLUS	128
IPHONE 15 PLUS	256
IPHONE 15 PLUS	512
IPHONE 15 PRO	128
IPHONE 15 PRO	256
IPHONE 15 PRO	512
IPHONE 15 PRO	1
IPHONE 15 PRO MAX	256
IPHONE 15 PRO MAX	512
IPHONE 15 PRO MAX	1
IPHONE 16	128
IPHONE 16	256
IPHONE 16	512
IPHONE 16 E	128
IPHONE 16 E	256
IPHONE 16 E	512
IPHONE 16 PLUS	128
IPHONE 16 PLUS	256
IPHONE 16 PLUS	512
IPHONE 16 PRO	128
IPHONE 16 PRO	256
IPHONE 16 PRO	512
IPHONE 16 PRO	1
IPHONE 16 PRO MAX	128
IPHONE 16 PRO MAX	256
IPHONE 16 PRO MAX	512
IPHONE 16 PRO MAX	1
IPHONE 17	256
IPHONE 17	512
IPHONE 17 AIR	256
IPHONE 17 AIR	512
IPHONE 17 AIR	1
IPHONE 17 AIR	2
IPHONE 17 PRO	256
IPHONE 17 PRO	512
IPHONE 17 PRO	1
IPHONE 17 PRO MAX	256
IPHONE 17 PRO MAX	512
IPHONE 17 PRO MAX	1
IPHONE 17 PRO MAX	2`;

const models = [];
let counter = 1;

const toTitleCase = (str) => {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    .replace(/iphone/i, 'iPhone')
    .replace(/pro/i, 'Pro')
    .replace(/max/i, 'Max')
    .replace(/mini/i, 'Mini')
    .replace(/plus/i, 'Plus')
    .replace(/ e$/i, ' E')
    .replace(/air/i, 'Air');
};

raw.split('\n').forEach(line => {
  if (!line.trim()) return;
  const [model, cap] = line.split('\t');
  let storage = cap;
  if (storage === '1') storage = '1TB';
  else if (storage === '2') storage = '2TB';
  else storage = storage + 'GB';
  
  let ano = 2024;
  if (model.includes('11')) ano = 2019;
  else if (model.includes('12')) ano = 2020;
  else if (model.includes('13')) ano = 2021;
  else if (model.includes('14')) ano = 2022;
  else if (model.includes('15')) ano = 2023;
  else if (model.includes('16')) ano = 2024;
  else if (model.includes('17')) ano = 2025;

  models.push({
    id: 'm' + counter++,
    marca: 'Apple',
    modelo: toTitleCase(model),
    armazenamento: storage,
    ano: ano,
    preco_medio_usado: 0,
    preco_medio_novo: 0,
    valor_base_upgrade: 0,
    status: 'active'
  });
});

console.log(JSON.stringify(models, null, 2));
