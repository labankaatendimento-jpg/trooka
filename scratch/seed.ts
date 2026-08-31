import { createClient } from '@supabase/supabase-js';

import { MOCK_IPHONE_MODELS, MOCK_STORES } from '../lib/mockData';

const supabaseUrl = "https://irouregsafylipfekfqg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyb3VyZWdzYWZ5bGlwZmVrZnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMDAwMDEsImV4cCI6MjEwMzc3NjAwMX0.ZFkowY5Hwlq69PnQiOeBSufNEkatDAdJZtM3CQ9J-qs";

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Iniciando a inserção de dados no Supabase...");

  try {
    // 1. Inserir Lojistas
    console.log(`Inserindo ${MOCK_STORES.length} lojas...`);
    const { error: storeError } = await supabase
      .from('stores')
      .upsert(MOCK_STORES.map(s => ({
        id: s.id,
        nome: s.nome,
        cnpj: s.cnpj,
        telefone: s.telefone,
        whatsapp: s.whatsapp,
        email: s.email,
        cidade: s.cidade,
        estado: s.estado,
        endereco: s.endereco,
        instagram: s.instagram,
        descricao: s.descricao,
        status: s.status,
        creditos: s.creditos,
        avaliacao_media: s.avaliacao_media,
        tempo_resposta: s.tempo_resposta
      })));

    if (storeError) {
      console.error("Erro ao inserir lojistas:", storeError);
      process.exit(1);
    }

    // 2. Inserir iPhones
    console.log(`Inserindo ${MOCK_IPHONE_MODELS.length} iPhones...`);
    const { error: modelsError } = await supabase
      .from('iphone_models')
      .upsert(MOCK_IPHONE_MODELS.map(m => ({
        id: m.id,
        marca: m.marca,
        modelo: m.modelo,
        armazenamento: m.armazenamento,
        ano: m.ano,
        preco_medio_novo: m.preco_medio_novo,
        preco_medio_usado: m.preco_medio_usado,
        valor_base_upgrade: m.valor_base_upgrade,
        status: m.status
      })));

    if (modelsError) {
      console.error("Erro ao inserir iPhones:", modelsError);
      process.exit(1);
    }

    console.log("✅ SEED CONCLUÍDO COM SUCESSO! Todos os dados foram inseridos.");
  } catch (err) {
    console.error("Erro fatal:", err);
  }
}

seed();
