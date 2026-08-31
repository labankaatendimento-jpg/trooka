-- =======================================================
-- SQL de Inicialização do Banco de Dados Trooka (Supabase)
-- =======================================================

-- Habilitar a extensão para gerar UUIDs (já vem habilitada por padrão no Supabase, mas é bom garantir)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela: iphone_models
CREATE TABLE iphone_models (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  marca TEXT NOT NULL DEFAULT 'Apple',
  modelo TEXT NOT NULL,
  armazenamento TEXT NOT NULL,
  ano INTEGER NOT NULL,
  preco_medio_novo NUMERIC(10,2) NOT NULL DEFAULT 0,
  preco_medio_usado NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_base_upgrade NUMERIC(10,2) NOT NULL DEFAULT 0,
  imagem TEXT,
  status TEXT NOT NULL DEFAULT 'active'
);

-- 2. Tabela: price_rules
CREATE TABLE price_rules (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  nome TEXT NOT NULL,
  percentual NUMERIC(5,2) NOT NULL
);

-- 3. Tabela: stores (Lojistas)
CREATE TABLE stores (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  nome TEXT NOT NULL,
  cnpj TEXT,
  telefone TEXT,
  whatsapp TEXT,
  email TEXT,
  cidade TEXT,
  estado TEXT,
  endereco TEXT,
  instagram TEXT,
  descricao TEXT,
  logo TEXT,
  fachada TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  creditos INTEGER NOT NULL DEFAULT 0,
  avaliacao_media NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  tempo_resposta INTEGER NOT NULL DEFAULT 0
);

-- 4. Tabela: upgrade_requests (Leads/Simulações)
CREATE TABLE upgrade_requests (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  modelo_atual_id TEXT,
  modelo_desejado_id TEXT,
  modelo_atual_nome TEXT NOT NULL,
  modelo_desejado_nome TEXT NOT NULL,
  estado_aparelho TEXT NOT NULL,
  bateria_saude TEXT,
  reparo_historico TEXT NOT NULL,
  condicao_desejado TEXT,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  valor_estimado NUMERIC(10,2) NOT NULL,
  diferenca_estimada NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  telefone_cliente TEXT NOT NULL,
  snapshot JSONB,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela: admin_logs
CREATE TABLE admin_logs (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  admin_id TEXT NOT NULL,
  acao TEXT NOT NULL,
  item_alterado TEXT NOT NULL,
  valor_anterior TEXT,
  novo_valor TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela: offers (Ofertas feitas pelos Lojistas)
CREATE TABLE offers (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  request_id TEXT NOT NULL REFERENCES upgrade_requests(id) ON DELETE CASCADE,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  valor_aparelho NUMERIC(10,2) NOT NULL,
  valor_novo NUMERIC(10,2) NOT NULL,
  diferenca NUMERIC(10,2) NOT NULL,
  observacao TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabela: credit_transactions (Histórico de Créditos)
CREATE TABLE credit_transactions (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
  store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =======================================================
-- INSERÇÃO DE DADOS INICIAIS (Opcional, mas recomendado)
-- =======================================================

-- Inserindo Regras de Preço (Price Rules) Iniciais (As mesmas do Simulador atual)
INSERT INTO price_rules (nome, percentual) VALUES
  ('Estado: Excelente', 1.00),
  ('Estado: Bom', 0.85),
  ('Estado: Usado', 0.65),
  ('Estado: Danificado', 0.35),
  ('Bateria: 90 - 100%', 1.00),
  ('Bateria: 80 - 89%', 0.95),
  ('Bateria: Abaixo de 80%', 0.85),
  ('Reparo: Já foi reparado', 0.85);

-- =======================================================
-- POLÍTICAS DE SEGURANÇA (RLS - Row Level Security)
-- =======================================================
-- Para facilitar o uso inicial sem autenticação complexa, vamos permitir acesso anônimo total.
-- (No futuro, quando tiver autenticação, você pode desativar isso)

-- Desabilitando o RLS temporariamente em todas as tabelas para que a API funcione sem bloqueios:
ALTER TABLE iphone_models DISABLE ROW LEVEL SECURITY;
ALTER TABLE price_rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE upgrade_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE offers DISABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions DISABLE ROW LEVEL SECURITY;
