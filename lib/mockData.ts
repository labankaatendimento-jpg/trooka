export interface IphoneModel {
  id: string;
  marca: string;
  modelo: string;
  armazenamento: string;
  ano: number;
  preco_medio_novo: number;
  preco_medio_usado: number;
  valor_base_upgrade: number;
  imagem?: string;
  status: string;
}

export const MOCK_IPHONE_MODELS: IphoneModel[] = [
  // iPhone 11 series (2019)
  { id: '11-64', marca: 'Apple', modelo: 'iPhone 11', armazenamento: '64GB', ano: 2019, preco_medio_novo: 3899, preco_medio_usado: 1400, valor_base_upgrade: 1300, status: 'active' },
  { id: '11-128', marca: 'Apple', modelo: 'iPhone 11', armazenamento: '128GB', ano: 2019, preco_medio_novo: 4299, preco_medio_usado: 1600, valor_base_upgrade: 1450, status: 'active' },
  { id: '11-pro-64', marca: 'Apple', modelo: 'iPhone 11 Pro', armazenamento: '64GB', ano: 2019, preco_medio_novo: 5999, preco_medio_usado: 1800, valor_base_upgrade: 1650, status: 'active' },
  { id: '11-pro-256', marca: 'Apple', modelo: 'iPhone 11 Pro', armazenamento: '256GB', ano: 2019, preco_medio_novo: 6999, preco_medio_usado: 2100, valor_base_upgrade: 1900, status: 'active' },
  { id: '11-pro-max-64', marca: 'Apple', modelo: 'iPhone 11 Pro Max', armazenamento: '64GB', ano: 2019, preco_medio_novo: 6599, preco_medio_usado: 2000, valor_base_upgrade: 1800, status: 'active' },
  { id: '11-pro-max-256', marca: 'Apple', modelo: 'iPhone 11 Pro Max', armazenamento: '256GB', ano: 2019, preco_medio_novo: 7599, preco_medio_usado: 2350, valor_base_upgrade: 2100, status: 'active' },

  // iPhone 12 series (2020)
  { id: '12-64', marca: 'Apple', modelo: 'iPhone 12', armazenamento: '64GB', ano: 2020, preco_medio_novo: 4599, preco_medio_usado: 1900, valor_base_upgrade: 1750, status: 'active' },
  { id: '12-128', marca: 'Apple', modelo: 'iPhone 12', armazenamento: '128GB', ano: 2020, preco_medio_novo: 4999, preco_medio_usado: 2100, valor_base_upgrade: 1950, status: 'active' },
  { id: '12-pro-128', marca: 'Apple', modelo: 'iPhone 12 Pro', armazenamento: '128GB', ano: 2020, preco_medio_novo: 6999, preco_medio_usado: 2600, valor_base_upgrade: 2400, status: 'active' },
  { id: '12-pro-256', marca: 'Apple', modelo: 'iPhone 12 Pro', armazenamento: '256GB', ano: 2020, preco_medio_novo: 7999, preco_medio_usado: 2900, valor_base_upgrade: 2650, status: 'active' },
  { id: '12-pro-max-128', marca: 'Apple', modelo: 'iPhone 12 Pro Max', armazenamento: '128GB', ano: 2020, preco_medio_novo: 7999, preco_medio_usado: 3100, valor_base_upgrade: 2850, status: 'active' },
  { id: '12-pro-max-256', marca: 'Apple', modelo: 'iPhone 12 Pro Max', armazenamento: '256GB', ano: 2020, preco_medio_novo: 8999, preco_medio_usado: 3400, valor_base_upgrade: 3100, status: 'active' },

  // iPhone 13 series (2021)
  { id: '13-128', marca: 'Apple', modelo: 'iPhone 13', armazenamento: '128GB', ano: 2021, preco_medio_novo: 5499, preco_medio_usado: 2500, valor_base_upgrade: 2300, status: 'active' },
  { id: '13-256', marca: 'Apple', modelo: 'iPhone 13', armazenamento: '256GB', ano: 2021, preco_medio_novo: 6499, preco_medio_usado: 2800, valor_base_upgrade: 2550, status: 'active' },
  { id: '13-pro-128', marca: 'Apple', modelo: 'iPhone 13 Pro', armazenamento: '128GB', ano: 2021, preco_medio_novo: 7499, preco_medio_usado: 3400, valor_base_upgrade: 3100, status: 'active' },
  { id: '13-pro-256', marca: 'Apple', modelo: 'iPhone 13 Pro', armazenamento: '256GB', ano: 2021, preco_medio_novo: 8499, preco_medio_usado: 3750, valor_base_upgrade: 3400, status: 'active' },
  { id: '13-pro-max-128', marca: 'Apple', modelo: 'iPhone 13 Pro Max', armazenamento: '128GB', ano: 2021, preco_medio_novo: 8499, preco_medio_usado: 3800, valor_base_upgrade: 3500, status: 'active' },
  { id: '13-pro-max-256', marca: 'Apple', modelo: 'iPhone 13 Pro Max', armazenamento: '256GB', ano: 2021, preco_medio_novo: 9499, preco_medio_usado: 4200, valor_base_upgrade: 3850, status: 'active' },

  // iPhone 14 series (2022)
  { id: '14-128', marca: 'Apple', modelo: 'iPhone 14', armazenamento: '128GB', ano: 2022, preco_medio_novo: 5999, preco_medio_usado: 3100, valor_base_upgrade: 2850, status: 'active' },
  { id: '14-256', marca: 'Apple', modelo: 'iPhone 14', armazenamento: '256GB', ano: 2022, preco_medio_novo: 6999, preco_medio_usado: 3450, valor_base_upgrade: 3150, status: 'active' },
  { id: '14-pro-128', marca: 'Apple', modelo: 'iPhone 14 Pro', armazenamento: '128GB', ano: 2022, preco_medio_novo: 8299, preco_medio_usado: 4300, valor_base_upgrade: 3950, status: 'active' },
  { id: '14-pro-256', marca: 'Apple', modelo: 'iPhone 14 Pro', armazenamento: '256GB', ano: 2022, preco_medio_novo: 9299, preco_medio_usado: 4700, valor_base_upgrade: 4300, status: 'active' },
  { id: '14-pro-max-128', marca: 'Apple', modelo: 'iPhone 14 Pro Max', armazenamento: '128GB', ano: 2022, preco_medio_novo: 9499, preco_medio_usado: 4800, valor_base_upgrade: 4400, status: 'active' },
  { id: '14-pro-max-256', marca: 'Apple', modelo: 'iPhone 14 Pro Max', armazenamento: '256GB', ano: 2022, preco_medio_novo: 10499, preco_medio_usado: 5300, valor_base_upgrade: 4800, status: 'active' },

  // iPhone 15 series (2023)
  { id: '15-128', marca: 'Apple', modelo: 'iPhone 15', armazenamento: '128GB', ano: 2023, preco_medio_novo: 7299, preco_medio_usado: 4100, valor_base_upgrade: 3750, status: 'active' },
  { id: '15-256', marca: 'Apple', modelo: 'iPhone 15', armazenamento: '256GB', ano: 2023, preco_medio_novo: 8299, preco_medio_usado: 4600, valor_base_upgrade: 4200, status: 'active' },
  { id: '15-pro-128', marca: 'Apple', modelo: 'iPhone 15 Pro', armazenamento: '128GB', ano: 2023, preco_medio_novo: 9299, preco_medio_usado: 5400, valor_base_upgrade: 4950, status: 'active' },
  { id: '15-pro-256', marca: 'Apple', modelo: 'iPhone 15 Pro', armazenamento: '256GB', ano: 2023, preco_medio_novo: 10299, preco_medio_usado: 5900, valor_base_upgrade: 5400, status: 'active' },
  { id: '15-pro-max-256', marca: 'Apple', modelo: 'iPhone 15 Pro Max', armazenamento: '256GB', ano: 2023, preco_medio_novo: 10999, preco_medio_usado: 6400, valor_base_upgrade: 5850, status: 'active' },
  { id: '15-pro-max-512', marca: 'Apple', modelo: 'iPhone 15 Pro Max', armazenamento: '512GB', ano: 2023, preco_medio_novo: 12999, preco_medio_usado: 7200, valor_base_upgrade: 6600, status: 'active' },

  // iPhone 16 series (2024)
  { id: '16-128', marca: 'Apple', modelo: 'iPhone 16', armazenamento: '128GB', ano: 2024, preco_medio_novo: 7799, preco_medio_usado: 5100, valor_base_upgrade: 4650, status: 'active' },
  { id: '16-256', marca: 'Apple', modelo: 'iPhone 16', armazenamento: '256GB', ano: 2024, preco_medio_novo: 8799, preco_medio_usado: 5700, valor_base_upgrade: 5200, status: 'active' },
  { id: '16-pro-128', marca: 'Apple', modelo: 'iPhone 16 Pro', armazenamento: '128GB', ano: 2024, preco_medio_novo: 9799, preco_medio_usado: 6800, valor_base_upgrade: 6200, status: 'active' },
  { id: '16-pro-256', marca: 'Apple', modelo: 'iPhone 16 Pro', armazenamento: '256GB', ano: 2024, preco_medio_novo: 10799, preco_medio_usado: 7400, valor_base_upgrade: 6750, status: 'active' },
  { id: '16-pro-max-256', marca: 'Apple', modelo: 'iPhone 16 Pro Max', armazenamento: '256GB', ano: 2024, preco_medio_novo: 12499, preco_medio_usado: 8500, valor_base_upgrade: 7750, status: 'active' },
  { id: '16-pro-max-512', marca: 'Apple', modelo: 'iPhone 16 Pro Max', armazenamento: '512GB', ano: 2024, preco_medio_novo: 14499, preco_medio_usado: 9400, valor_base_upgrade: 8550, status: 'active' },

  // iPhone 17 Future series (target upgrade selection)
  { id: '17-128', marca: 'Apple', modelo: 'iPhone 17', armazenamento: '128GB', ano: 2025, preco_medio_novo: 7990, preco_medio_usado: 0, valor_base_upgrade: 0, status: 'active' },
  { id: '17-256', marca: 'Apple', modelo: 'iPhone 17', armazenamento: '256GB', ano: 2025, preco_medio_novo: 8990, preco_medio_usado: 0, valor_base_upgrade: 0, status: 'active' },
  { id: '17-air-128', marca: 'Apple', modelo: 'iPhone 17 Air', armazenamento: '128GB', ano: 2025, preco_medio_novo: 8990, preco_medio_usado: 0, valor_base_upgrade: 0, status: 'active' },
  { id: '17-air-256', marca: 'Apple', modelo: 'iPhone 17 Air', armazenamento: '256GB', ano: 2025, preco_medio_novo: 9990, preco_medio_usado: 0, valor_base_upgrade: 0, status: 'active' },
  { id: '17-pro-128', marca: 'Apple', modelo: 'iPhone 17 Pro', armazenamento: '128GB', ano: 2025, preco_medio_novo: 9990, preco_medio_usado: 0, valor_base_upgrade: 0, status: 'active' },
  { id: '17-pro-256', marca: 'Apple', modelo: 'iPhone 17 Pro', armazenamento: '256GB', ano: 2025, preco_medio_novo: 10990, preco_medio_usado: 0, valor_base_upgrade: 0, status: 'active' },
  { id: '17-pro-max-256', marca: 'Apple', modelo: 'iPhone 17 Pro Max', armazenamento: '256GB', ano: 2025, preco_medio_novo: 12490, preco_medio_usado: 0, valor_base_upgrade: 0, status: 'active' },
  { id: '17-pro-max-512', marca: 'Apple', modelo: 'iPhone 17 Pro Max', armazenamento: '512GB', ano: 2025, preco_medio_novo: 14490, preco_medio_usado: 0, valor_base_upgrade: 0, status: 'active' },
];

export interface Store {
  id: string;
  nome: string;
  cnpj: string;
  telefone: string;
  whatsapp: string;
  email: string;
  cidade: string;
  estado: string;
  endereco: string;
  instagram?: string;
  descricao?: string;
  logo?: string;
  fachada?: string;
  status: 'pending' | 'active' | 'suspended';
  creditos: number;
  avaliacao_media: number;
  tempo_resposta: number; // in minutes
}

export const MOCK_STORES: Store[] = [
  {
    id: 'store-1',
    nome: 'Apple Place Campinas',
    cnpj: '12.345.678/0001-90',
    telefone: '(19) 99876-5432',
    whatsapp: '5519998765432',
    email: 'contato@appleplace.com.br',
    cidade: 'Campinas',
    estado: 'SP',
    endereco: 'Av. Coronel Silva Teles, 123 - Cambuí, Campinas - SP',
    instagram: '@appleplace_campinas',
    descricao: 'Especialistas em iPhone novos e seminovos com garantia. Venha fazer seu upgrade!',
    status: 'active',
    creditos: 15,
    avaliacao_media: 4.85,
    tempo_resposta: 12,
  },
  {
    id: 'store-2',
    nome: 'iStock Campinas',
    cnpj: '98.765.432/0001-21',
    telefone: '(19) 99123-4567',
    whatsapp: '5519991234567',
    email: 'contato@istockcampinas.com',
    cidade: 'Campinas',
    estado: 'SP',
    endereco: 'Rua General Osório, 1420 - Centro, Campinas - SP',
    instagram: '@istock.campinas',
    descricao: 'Seu iPhone usado vale muito na troca por um modelo mais novo. Avaliação rápida.',
    status: 'active',
    creditos: 8,
    avaliacao_media: 4.70,
    tempo_resposta: 15,
  },
  {
    id: 'store-3',
    nome: 'Campinas Prime Tech',
    cnpj: '45.678.901/0001-34',
    telefone: '(19) 98888-1111',
    whatsapp: '5519988881111',
    email: 'vendas@campinasprimetech.com.br',
    cidade: 'Campinas',
    estado: 'SP',
    endereco: 'Shopping Parque D. Pedro - Av. Guilherme Campos, 500 - Campinas - SP',
    instagram: '@campinasprimetech',
    descricao: 'A maior variedade de iPhones da região com as melhores taxas de parcelamento.',
    status: 'active',
    creditos: 25,
    avaliacao_media: 4.95,
    tempo_resposta: 8,
  },
  {
    id: 'store-4',
    nome: 'iPoint Sorocaba',
    cnpj: '11.222.333/0001-44',
    telefone: '(15) 99777-6666',
    whatsapp: '5515997776666',
    email: 'sorocaba@ipoint.com.br',
    cidade: 'Sorocaba',
    estado: 'SP',
    endereco: 'Av. Izoraida Marques Peres, 401 - Campolim, Sorocaba - SP',
    instagram: '@ipoint.sorocaba',
    status: 'active',
    creditos: 5,
    avaliacao_media: 4.60,
    tempo_resposta: 20,
  }
];

export interface PriceRule {
  id: string;
  nome: string;
  percentual: number;
}

export const MOCK_PRICE_RULES: PriceRule[] = [
  { id: '1', nome: 'Excelente', percentual: 1.00 },
  { id: '2', nome: 'Bom', percentual: 0.94 },
  { id: '3', nome: 'Marcas', percentual: 0.88 },
  { id: '4', nome: 'Tela Quebrada', percentual: 0.72 },
  { id: '5', nome: 'Reparado', percentual: 0.85 },
];
