-- Schema definition for Project Atlas (Trooka Core)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: iphone_models
CREATE TABLE IF NOT EXISTS iphone_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    marca VARCHAR(50) DEFAULT 'Apple' NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    armazenamento VARCHAR(20) NOT NULL,
    ano INT NOT NULL,
    preco_medio_novo NUMERIC(10, 2) NOT NULL,
    preco_medio_usado NUMERIC(10, 2) NOT NULL,
    valor_base_upgrade NUMERIC(10, 2) NOT NULL,
    imagem TEXT,
    status VARCHAR(20) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: stores
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    whatsapp VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    endereco TEXT NOT NULL,
    instagram VARCHAR(100),
    descricao TEXT,
    logo TEXT,
    fachada TEXT,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, active, suspended
    creditos INT DEFAULT 0 NOT NULL,
    avaliacao_media NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
    tempo_resposta INT DEFAULT 15 NOT NULL, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: stock
CREATE TABLE IF NOT EXISTS stock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    iphone_model_id UUID REFERENCES iphone_models(id) ON DELETE CASCADE NOT NULL,
    quantidade INT DEFAULT 0 NOT NULL,
    ativo BOOLEAN DEFAULT true NOT NULL,
    UNIQUE(store_id, iphone_model_id)
);

-- Table: upgrade_requests
CREATE TABLE IF NOT EXISTS upgrade_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    modelo_atual_id UUID REFERENCES iphone_models(id) ON DELETE SET NULL,
    modelo_desejado_id UUID REFERENCES iphone_models(id) ON DELETE SET NULL,
    modelo_atual_nome VARCHAR(100) NOT NULL,
    modelo_desejado_nome VARCHAR(100) NOT NULL,
    estado_aparelho VARCHAR(50) NOT NULL, -- excelente, bom, marcas, tela_quebrada
    reparo_historico VARCHAR(20) NOT NULL, -- sim, nao, nao_sei
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    valor_estimado NUMERIC(10, 2) NOT NULL,
    diferenca_estimada NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, offers_available, chosen, completed
    telefone_cliente VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: offers
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES upgrade_requests(id) ON DELETE CASCADE NOT NULL,
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    valor_aparelho NUMERIC(10, 2) NOT NULL,
    valor_novo NUMERIC(10, 2) NOT NULL,
    diferenca NUMERIC(10, 2) NOT NULL,
    observacao TEXT,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- pending, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: credits
CREATE TABLE IF NOT EXISTS credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- purchase, usage, refund
    quantidade INT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: price_rules
CREATE TABLE IF NOT EXISTS price_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(50) UNIQUE NOT NULL,
    percentual NUMERIC(4, 2) NOT NULL, -- multiplier (e.g. 1.00 for Excelente, 0.94 for Bom)
    status VARCHAR(20) DEFAULT 'active' NOT NULL
);

-- Insert default price rules
INSERT INTO price_rules (nome, percentual) VALUES
('Excelente', 1.00)
ON CONFLICT (nome) DO UPDATE SET percentual = EXCLUDED.percentual;

INSERT INTO price_rules (nome, percentual) VALUES
('Bom', 0.94)
ON CONFLICT (nome) DO UPDATE SET percentual = EXCLUDED.percentual;

INSERT INTO price_rules (nome, percentual) VALUES
('Marcas', 0.88)
ON CONFLICT (nome) DO UPDATE SET percentual = EXCLUDED.percentual;

INSERT INTO price_rules (nome, percentual) VALUES
('Tela Quebrada', 0.72)
ON CONFLICT (nome) DO UPDATE SET percentual = EXCLUDED.percentual;

INSERT INTO price_rules (nome, percentual) VALUES
('Reparado', 0.85)
ON CONFLICT (nome) DO UPDATE SET percentual = EXCLUDED.percentual;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_iphone_models_modelo ON iphone_models(modelo);
CREATE INDEX IF NOT EXISTS idx_stores_cidade_estado ON stores(cidade, estado);
CREATE INDEX IF NOT EXISTS idx_stock_store ON stock(store_id);
CREATE INDEX IF NOT EXISTS idx_upgrade_requests_status ON upgrade_requests(status);
CREATE INDEX IF NOT EXISTS idx_offers_request ON offers(request_id);
