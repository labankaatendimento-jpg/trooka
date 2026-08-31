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
  {
    "id": "m1",
    "marca": "Apple",
    "modelo": "iPhone 11",
    "armazenamento": "64GB",
    "ano": 2019,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 900,
    "status": "active"
  },
  {
    "id": "m2",
    "marca": "Apple",
    "modelo": "iPhone 11",
    "armazenamento": "128GB",
    "ano": 2019,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1000,
    "status": "active"
  },
  {
    "id": "m3",
    "marca": "Apple",
    "modelo": "iPhone 11",
    "armazenamento": "256GB",
    "ano": 2019,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1100,
    "status": "active"
  },
  {
    "id": "m4",
    "marca": "Apple",
    "modelo": "iPhone 11 Pro",
    "armazenamento": "64GB",
    "ano": 2019,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1000,
    "status": "active"
  },
  {
    "id": "m5",
    "marca": "Apple",
    "modelo": "iPhone 11 Pro",
    "armazenamento": "256GB",
    "ano": 2019,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1200,
    "status": "active"
  },
  {
    "id": "m6",
    "marca": "Apple",
    "modelo": "iPhone 11 Pro",
    "armazenamento": "512GB",
    "ano": 2019,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1300,
    "status": "active"
  },
  {
    "id": "m7",
    "marca": "Apple",
    "modelo": "iPhone 11 Pro Max",
    "armazenamento": "64GB",
    "ano": 2019,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1200,
    "status": "active"
  },
  {
    "id": "m8",
    "marca": "Apple",
    "modelo": "iPhone 11 Pro Max",
    "armazenamento": "256GB",
    "ano": 2019,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1300,
    "status": "active"
  },
  {
    "id": "m9",
    "marca": "Apple",
    "modelo": "iPhone 11 Pro Max",
    "armazenamento": "512GB",
    "ano": 2019,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1400,
    "status": "active"
  },
  {
    "id": "m13",
    "marca": "Apple",
    "modelo": "iPhone 12 Mini",
    "armazenamento": "64GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1100,
    "status": "active"
  },
  {
    "id": "m14",
    "marca": "Apple",
    "modelo": "iPhone 12 Mini",
    "armazenamento": "128GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1200,
    "status": "active"
  },
  {
    "id": "m15",
    "marca": "Apple",
    "modelo": "iPhone 12 Mini",
    "armazenamento": "256GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1300,
    "status": "active"
  },
  {
    "id": "m10",
    "marca": "Apple",
    "modelo": "iPhone 12",
    "armazenamento": "64GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1000,
    "status": "active"
  },
  {
    "id": "m11",
    "marca": "Apple",
    "modelo": "iPhone 12",
    "armazenamento": "128GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1100,
    "status": "active"
  },
  {
    "id": "m12",
    "marca": "Apple",
    "modelo": "iPhone 12",
    "armazenamento": "256GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1200,
    "status": "active"
  },
  {
    "id": "m16",
    "marca": "Apple",
    "modelo": "iPhone 12 Pro",
    "armazenamento": "128GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1400,
    "status": "active"
  },
  {
    "id": "m17",
    "marca": "Apple",
    "modelo": "iPhone 12 Pro",
    "armazenamento": "256GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1500,
    "status": "active"
  },
  {
    "id": "m18",
    "marca": "Apple",
    "modelo": "iPhone 12 Pro",
    "armazenamento": "512GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1600,
    "status": "active"
  },
  {
    "id": "m19",
    "marca": "Apple",
    "modelo": "iPhone 12 Pro Max",
    "armazenamento": "128GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1700,
    "status": "active"
  },
  {
    "id": "m20",
    "marca": "Apple",
    "modelo": "iPhone 12 Pro Max",
    "armazenamento": "256GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1800,
    "status": "active"
  },
  {
    "id": "m21",
    "marca": "Apple",
    "modelo": "iPhone 12 Pro Max",
    "armazenamento": "512GB",
    "ano": 2020,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1900,
    "status": "active"
  },
  {
    "id": "m25",
    "marca": "Apple",
    "modelo": "iPhone 13 Mini",
    "armazenamento": "128GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1400,
    "status": "active"
  },
  {
    "id": "m26",
    "marca": "Apple",
    "modelo": "iPhone 13 Mini",
    "armazenamento": "256GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1500,
    "status": "active"
  },
  {
    "id": "m27",
    "marca": "Apple",
    "modelo": "iPhone 13 Mini",
    "armazenamento": "512GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1600,
    "status": "active"
  },
  {
    "id": "m22",
    "marca": "Apple",
    "modelo": "iPhone 13",
    "armazenamento": "128GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1000,
    "status": "active"
  },
  {
    "id": "m23",
    "marca": "Apple",
    "modelo": "iPhone 13",
    "armazenamento": "256GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1100,
    "status": "active"
  },
  {
    "id": "m24",
    "marca": "Apple",
    "modelo": "iPhone 13",
    "armazenamento": "512GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1200,
    "status": "active"
  },
  {
    "id": "m28",
    "marca": "Apple",
    "modelo": "iPhone 13 Pro",
    "armazenamento": "128GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1700,
    "status": "active"
  },
  {
    "id": "m29",
    "marca": "Apple",
    "modelo": "iPhone 13 Pro",
    "armazenamento": "256GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1800,
    "status": "active"
  },
  {
    "id": "m30",
    "marca": "Apple",
    "modelo": "iPhone 13 Pro",
    "armazenamento": "512GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1900,
    "status": "active"
  },
  {
    "id": "m31",
    "marca": "Apple",
    "modelo": "iPhone 13 Pro",
    "armazenamento": "1TB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2000,
    "status": "active"
  },
  {
    "id": "m32",
    "marca": "Apple",
    "modelo": "iPhone 13 Pro Max",
    "armazenamento": "128GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2100,
    "status": "active"
  },
  {
    "id": "m33",
    "marca": "Apple",
    "modelo": "iPhone 13 Pro Max",
    "armazenamento": "256GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2300,
    "status": "active"
  },
  {
    "id": "m34",
    "marca": "Apple",
    "modelo": "iPhone 13 Pro Max",
    "armazenamento": "512GB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2500,
    "status": "active"
  },
  {
    "id": "m35",
    "marca": "Apple",
    "modelo": "iPhone 13 Pro Max",
    "armazenamento": "1TB",
    "ano": 2021,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2700,
    "status": "active"
  },
  {
    "id": "m36",
    "marca": "Apple",
    "modelo": "iPhone 14",
    "armazenamento": "128GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1500,
    "status": "active"
  },
  {
    "id": "m37",
    "marca": "Apple",
    "modelo": "iPhone 14",
    "armazenamento": "256GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1600,
    "status": "active"
  },
  {
    "id": "m38",
    "marca": "Apple",
    "modelo": "iPhone 14",
    "armazenamento": "512GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1700,
    "status": "active"
  },
  {
    "id": "m39",
    "marca": "Apple",
    "modelo": "iPhone 14 Plus",
    "armazenamento": "128GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1700,
    "status": "active"
  },
  {
    "id": "m40",
    "marca": "Apple",
    "modelo": "iPhone 14 Plus",
    "armazenamento": "256GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1800,
    "status": "active"
  },
  {
    "id": "m41",
    "marca": "Apple",
    "modelo": "iPhone 14 Plus",
    "armazenamento": "512GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 1900,
    "status": "active"
  },
  {
    "id": "m42",
    "marca": "Apple",
    "modelo": "iPhone 14 Pro",
    "armazenamento": "128GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2200,
    "status": "active"
  },
  {
    "id": "m43",
    "marca": "Apple",
    "modelo": "iPhone 14 Pro",
    "armazenamento": "256GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2300,
    "status": "active"
  },
  {
    "id": "m44",
    "marca": "Apple",
    "modelo": "iPhone 14 Pro",
    "armazenamento": "512GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2400,
    "status": "active"
  },
  {
    "id": "m45",
    "marca": "Apple",
    "modelo": "iPhone 14 Pro",
    "armazenamento": "1TB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2500,
    "status": "active"
  },
  {
    "id": "m46",
    "marca": "Apple",
    "modelo": "iPhone 14 Pro Max",
    "armazenamento": "128GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2500,
    "status": "active"
  },
  {
    "id": "m47",
    "marca": "Apple",
    "modelo": "iPhone 14 Pro Max",
    "armazenamento": "256GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2600,
    "status": "active"
  },
  {
    "id": "m48",
    "marca": "Apple",
    "modelo": "iPhone 14 Pro Max",
    "armazenamento": "512GB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2700,
    "status": "active"
  },
  {
    "id": "m49",
    "marca": "Apple",
    "modelo": "iPhone 14 Pro Max",
    "armazenamento": "1TB",
    "ano": 2022,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2800,
    "status": "active"
  },
  {
    "id": "m50",
    "marca": "Apple",
    "modelo": "iPhone 15",
    "armazenamento": "128GB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2200,
    "status": "active"
  },
  {
    "id": "m51",
    "marca": "Apple",
    "modelo": "iPhone 15",
    "armazenamento": "256GB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2300,
    "status": "active"
  },
  {
    "id": "m52",
    "marca": "Apple",
    "modelo": "iPhone 15",
    "armazenamento": "512GB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2400,
    "status": "active"
  },
  {
    "id": "m53",
    "marca": "Apple",
    "modelo": "iPhone 15 Plus",
    "armazenamento": "128GB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2500,
    "status": "active"
  },
  {
    "id": "m54",
    "marca": "Apple",
    "modelo": "iPhone 15 Plus",
    "armazenamento": "256GB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2600,
    "status": "active"
  },
  {
    "id": "m55",
    "marca": "Apple",
    "modelo": "iPhone 15 Plus",
    "armazenamento": "512GB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2700,
    "status": "active"
  },
  {
    "id": "m56",
    "marca": "Apple",
    "modelo": "iPhone 15 Pro",
    "armazenamento": "128GB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2700,
    "status": "active"
  },
  {
    "id": "m57",
    "marca": "Apple",
    "modelo": "iPhone 15 Pro",
    "armazenamento": "256GB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2800,
    "status": "active"
  },
  {
    "id": "m58",
    "marca": "Apple",
    "modelo": "iPhone 15 Pro",
    "armazenamento": "512GB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2900,
    "status": "active"
  },
  {
    "id": "m59",
    "marca": "Apple",
    "modelo": "iPhone 15 Pro",
    "armazenamento": "1TB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3000,
    "status": "active"
  },
  {
    "id": "m60",
    "marca": "Apple",
    "modelo": "iPhone 15 Pro Max",
    "armazenamento": "256GB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3500,
    "status": "active"
  },
  {
    "id": "m61",
    "marca": "Apple",
    "modelo": "iPhone 15 Pro Max",
    "armazenamento": "512GB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3700,
    "status": "active"
  },
  {
    "id": "m62",
    "marca": "Apple",
    "modelo": "iPhone 15 Pro Max",
    "armazenamento": "1TB",
    "ano": 2023,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3900,
    "status": "active"
  },
  {
    "id": "m63",
    "marca": "Apple",
    "modelo": "iPhone 16",
    "armazenamento": "128GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2900,
    "status": "active"
  },
  {
    "id": "m66",
    "marca": "Apple",
    "modelo": "iPhone 16 E",
    "armazenamento": "128GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3000,
    "status": "active"
  },
  {
    "id": "m64",
    "marca": "Apple",
    "modelo": "iPhone 16",
    "armazenamento": "256GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3100,
    "status": "active"
  },
  {
    "id": "m67",
    "marca": "Apple",
    "modelo": "iPhone 16 E",
    "armazenamento": "256GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2000,
    "status": "active"
  },
  {
    "id": "m65",
    "marca": "Apple",
    "modelo": "iPhone 16",
    "armazenamento": "512GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2100,
    "status": "active"
  },
  {
    "id": "m68",
    "marca": "Apple",
    "modelo": "iPhone 16 E",
    "armazenamento": "512GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 2200,
    "status": "active"
  },
  {
    "id": "m69",
    "marca": "Apple",
    "modelo": "iPhone 16 Plus",
    "armazenamento": "128GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3100,
    "status": "active"
  },
  {
    "id": "m70",
    "marca": "Apple",
    "modelo": "iPhone 16 Plus",
    "armazenamento": "256GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3200,
    "status": "active"
  },
  {
    "id": "m71",
    "marca": "Apple",
    "modelo": "iPhone 16 Plus",
    "armazenamento": "512GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3300,
    "status": "active"
  },
  {
    "id": "m72",
    "marca": "Apple",
    "modelo": "iPhone 16 Pro",
    "armazenamento": "128GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3400,
    "status": "active"
  },
  {
    "id": "m73",
    "marca": "Apple",
    "modelo": "iPhone 16 Pro",
    "armazenamento": "256GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3500,
    "status": "active"
  },
  {
    "id": "m74",
    "marca": "Apple",
    "modelo": "iPhone 16 Pro",
    "armazenamento": "512GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3600,
    "status": "active"
  },
  {
    "id": "m75",
    "marca": "Apple",
    "modelo": "iPhone 16 Pro",
    "armazenamento": "1TB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 3700,
    "status": "active"
  },
  {
    "id": "m76",
    "marca": "Apple",
    "modelo": "iPhone 16 Pro Max",
    "armazenamento": "128GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4000,
    "status": "active"
  },
  {
    "id": "m77",
    "marca": "Apple",
    "modelo": "iPhone 16 Pro Max",
    "armazenamento": "256GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4100,
    "status": "active"
  },
  {
    "id": "m78",
    "marca": "Apple",
    "modelo": "iPhone 16 Pro Max",
    "armazenamento": "512GB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4200,
    "status": "active"
  },
  {
    "id": "m79",
    "marca": "Apple",
    "modelo": "iPhone 16 Pro Max",
    "armazenamento": "1TB",
    "ano": 2024,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4300,
    "status": "active"
  },
  {
    "id": "m80",
    "marca": "Apple",
    "modelo": "iPhone 17",
    "armazenamento": "256GB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4000,
    "status": "active"
  },
  {
    "id": "m81",
    "marca": "Apple",
    "modelo": "iPhone 17",
    "armazenamento": "512GB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4100,
    "status": "active"
  },
  {
    "id": "m82",
    "marca": "Apple",
    "modelo": "iPhone 17 Air",
    "armazenamento": "256GB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4200,
    "status": "active"
  },
  {
    "id": "m83",
    "marca": "Apple",
    "modelo": "iPhone 17 Air",
    "armazenamento": "512GB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4300,
    "status": "active"
  },
  {
    "id": "m84",
    "marca": "Apple",
    "modelo": "iPhone 17 Air",
    "armazenamento": "1TB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4400,
    "status": "active"
  },
  {
    "id": "m85",
    "marca": "Apple",
    "modelo": "iPhone 17 Air",
    "armazenamento": "2TB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4500,
    "status": "active"
  },
  {
    "id": "m86",
    "marca": "Apple",
    "modelo": "iPhone 17 Pro",
    "armazenamento": "256GB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4700,
    "status": "active"
  },
  {
    "id": "m87",
    "marca": "Apple",
    "modelo": "iPhone 17 Pro",
    "armazenamento": "512GB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4800,
    "status": "active"
  },
  {
    "id": "m88",
    "marca": "Apple",
    "modelo": "iPhone 17 Pro",
    "armazenamento": "1TB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 4900,
    "status": "active"
  },
  {
    "id": "m89",
    "marca": "Apple",
    "modelo": "iPhone 17 Pro Max",
    "armazenamento": "256GB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 5500,
    "status": "active"
  },
  {
    "id": "m90",
    "marca": "Apple",
    "modelo": "iPhone 17 Pro Max",
    "armazenamento": "512GB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 5600,
    "status": "active"
  },
  {
    "id": "m91",
    "marca": "Apple",
    "modelo": "iPhone 17 Pro Max",
    "armazenamento": "1TB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 5700,
    "status": "active"
  },
  {
    "id": "m92",
    "marca": "Apple",
    "modelo": "iPhone 17 Pro Max",
    "armazenamento": "2TB",
    "ano": 2025,
    "preco_medio_usado": 0,
    "preco_medio_novo": 0,
    "valor_base_upgrade": 5800,
    "status": "active"
  }
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
