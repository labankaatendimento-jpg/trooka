const Papa = require('papaparse');

const csv1 = `marca,modelo,armazenamento,estado,valor usado
APPLE,IPHONE XR,64,USADO,700`;

const csv2 = `marca,modelo,armazenamento,estado,valor_venda
APPLE,IPHONE XR,64,SEMI NOVO,1299`;

const csv3 = `Modelo do Aparelho,Capacidade,Preço de Compra,Preço de Venda
iPhone 11,128,1400,2000`;

function parse(csv) {
    let parsedModels = [];
    Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => h.trim().toLowerCase(),
        complete: (results) => {
            results.data.forEach((row) => {
                const parseNumber = (val) => {
                    if (!val) return undefined;
                    const match = val.toString().match(/[\d,.]+/);
                    if (!match) return undefined;
                    let clean = match[0].replace(/\./g, '').replace(',', '.');
                    const num = parseFloat(clean);
                    return isNaN(num) ? undefined : num;
                };

                const rawModelo = row.modelo?.toString().trim() || row['modelo do aparelho']?.toString().trim() || '';
                const modelo = rawModelo.replace(/^apple\s+/i, '').trim();

                let armazenamento = row.armazenamento?.toString().trim() || row['capacidade']?.toString().trim();
                if (armazenamento && /^\d+$/.test(armazenamento)) {
                  armazenamento = `${armazenamento}GB`;
                }

                let valUsado = parseNumber(row.preco_medio_usado) ?? parseNumber(row['valor usado']) ?? parseNumber(row['valor de compra']) ?? parseNumber(row['preço de compra']);
                let valNovo = parseNumber(row.preco_medio_novo) ?? parseNumber(row.valor_venda) ?? parseNumber(row['valor de venda']) ?? parseNumber(row['preço de venda']);
                
                const estado = row.estado?.toString().trim().toUpperCase();
                
                if (estado) {
                   let genericVal = parseNumber(row.valor) ?? parseNumber(row.preço) ?? parseNumber(row.preco) ?? parseNumber(row['valor usado']) ?? parseNumber(row['valor_venda']) ?? parseNumber(row['valor de compra']) ?? parseNumber(row['valor de venda']);
                   
                   if (genericVal !== undefined) {
                       if (estado.includes('SEMI') || estado.includes('NOVO')) {
                           valNovo = genericVal;
                       } else if (estado.includes('USADO')) {
                           valUsado = genericVal;
                       }
                   }
                }

                const valBase = parseNumber(row.valor_base_upgrade) ?? valUsado;
                const ano = parseInt(row.ano);
                
                if (modelo && armazenamento) {
                  parsedModels.push({
                    marca: row.marca || 'Apple',
                    modelo: modelo,
                    armazenamento: armazenamento,
                    ...(ano ? { ano } : {}),
                    ...(valUsado !== undefined ? { preco_medio_usado: valUsado } : {}),
                    ...(valNovo !== undefined ? { preco_medio_novo: valNovo } : {}),
                    ...(valBase !== undefined ? { valor_base_upgrade: valBase } : {})
                  });
                }
            });
        }
    });
    return parsedModels;
}

console.log('Parsed CSV 1:', parse(csv1));
console.log('Parsed CSV 2:', parse(csv2));
console.log('Parsed CSV 3:', parse(csv3));
