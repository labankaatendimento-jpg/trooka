import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_IPHONE_MODELS, MOCK_STORES, MOCK_PRICE_RULES, IphoneModel, Store, PriceRule } from '@/lib/mockData';

// Helper to check if we are on client side (for localStorage fallback)
const isClient = typeof window !== 'undefined';

// Local storage lists for Local Mode
const getLocalData = <T>(key: string, defaultValue: T[]): T[] => {
  if (!isClient) return defaultValue;
  const stored = localStorage.getItem(`trooka_${key}`);
  if (!stored) {
    localStorage.setItem(`trooka_${key}`, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultValue;
  }
};

const setLocalData = <T>(key: string, data: T[]): void => {
  if (isClient) {
    localStorage.setItem(`trooka_${key}`, JSON.stringify(data));
  }
};

// Initial state setup for localStorage
export interface UpgradeRequest {
  id: string;
  modelo_atual_id: string | null;
  modelo_desejado_id: string | null;
  modelo_atual_nome: string;
  modelo_desejado_nome: string;
  estado_aparelho: 'excelente' | 'bom' | 'marcas' | 'tela_quebrada';
  bateria_saude?: '90_100' | '80_89' | 'abaixo_80';
  reparo_historico: 'sim' | 'nao' | 'nao_sei';
  condicao_desejado?: 'novo' | 'seminovo';
  cidade: string;
  estado: string;
  valor_estimado: number;
  diferenca_estimada: number;
  status: 'pending' | 'offers_available' | 'chosen' | 'completed';
  telefone_cliente: string;
  created_at: string;
  snapshot?: {
    preco_mercado_usado: number;
    preco_mercado_novo: number;
    valor_base_upgrade: number;
    regra_estado_nome: string;
    regra_estado_multiplicador: number;
  };
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  acao: string;
  item_alterado: string;
  valor_anterior: string;
  novo_valor: string;
  created_at: string;
}

export interface Offer {
  id: string;
  request_id: string;
  store_id: string;
  valor_aparelho: number;
  valor_novo: number;
  diferenca: number;
  observacao?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  // Join properties
  store?: Store;
  request?: UpgradeRequest;
}

export interface CreditTx {
  id: string;
  store_id: string;
  tipo: 'purchase' | 'usage' | 'refund';
  quantidade: number;
  descricao: string;
  created_at: string;
}

export const dbService = {
  // --- IPHONE MODELS ---
  async getIphoneModels(): Promise<IphoneModel[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('iphone_models')
        .select('*')
        .eq('status', 'active');
      if (!error && data) return data;
    }
    let models = getLocalData<IphoneModel>('models_v4', MOCK_IPHONE_MODELS);
    return models;
  },

  async addIphoneModel(model: Omit<IphoneModel, 'id'>): Promise<IphoneModel> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('iphone_models')
        .insert([model])
        .select()
        .single();
      if (!error && data) return data;
      throw error || new Error('Failed to insert model');
    }
    const models = getLocalData<IphoneModel>('models', MOCK_IPHONE_MODELS);
    const newModel: IphoneModel = {
      ...model,
      id: Math.random().toString(36).substr(2, 9),
    };
    models.push(newModel);
    setLocalData('models_v4', models);
    return newModel;
  },

  async updateIphoneModel(id: string, updates: Partial<IphoneModel>): Promise<IphoneModel> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('iphone_models')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
      throw error || new Error('Failed to update model');
    }
    const models = getLocalData<IphoneModel>('models_v4', MOCK_IPHONE_MODELS);
    const idx = models.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('Model not found');
    models[idx] = { ...models[idx], ...updates };
    setLocalData('models_v4', models);
    return models[idx];
  },

  async bulkUpsertIphoneModels(newModels: Partial<IphoneModel>[]): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      // Para o Supabase, a melhor prática seria usar .upsert, 
      // mas precisamos garantir um ID ou chave única real.
      // Se tivermos conflitos, o supabase.upsert() lida com isso.
      // Porém, como estamos no Mock na maioria das vezes, o foco será no localStorage abaixo.
      const { error } = await supabase.from('iphone_models').upsert(newModels, { onConflict: 'modelo, armazenamento' });
      if (error) throw error;
      return;
    }
    
    // Fallback: LocalStorage
    let models = await this.getIphoneModels();
    
    newModels.forEach(incoming => {
      if (!incoming.modelo || !incoming.armazenamento) return;

      const normStr = (str: string) => str.toLowerCase().replace(/^apple\s+/i, '').replace(/["']/g, '').replace(/\s+/g, ' ').trim();
      const normStorage = (str: string) => str.toLowerCase().replace(/[^0-9]/g, '');

      // Tentar achar um modelo existente pelo Nome + Armazenamento
      const idx = models.findIndex(
        m => normStr(m.modelo) === normStr(incoming.modelo!) && 
             normStorage(m.armazenamento) === normStorage(incoming.armazenamento!)
      );

      if (idx !== -1) {
        // Atualizar apenas se o novo valor for maior que zero ou se não tínhamos valor antes
        models[idx] = { 
          ...models[idx], 
          preco_medio_usado: (incoming.preco_medio_usado && incoming.preco_medio_usado > 0) ? incoming.preco_medio_usado : models[idx].preco_medio_usado,
          preco_medio_novo: (incoming.preco_medio_novo && incoming.preco_medio_novo > 0) ? incoming.preco_medio_novo : models[idx].preco_medio_novo,
          valor_base_upgrade: (incoming.valor_base_upgrade && incoming.valor_base_upgrade > 0) ? incoming.valor_base_upgrade : models[idx].valor_base_upgrade,
          ano: incoming.ano ?? models[idx].ano
        };
      } else {
        // Inserir novo (com defaults se faltar algo)
        models.push({
          marca: incoming.marca || 'Apple',
          modelo: incoming.modelo,
          armazenamento: incoming.armazenamento,
          ano: incoming.ano || 2024,
          preco_medio_usado: incoming.preco_medio_usado || 0,
          preco_medio_novo: incoming.preco_medio_novo || 0,
          valor_base_upgrade: incoming.valor_base_upgrade || 0,
          id: Math.random().toString(36).substr(2, 9),
          status: 'active'
        } as IphoneModel);
      }
    });

    setLocalData('models_v4', models);
  },

  // --- STORES ---
  async getStores(): Promise<Store[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('stores').select('*');
      if (!error && data) return data;
    }
    return getLocalData<Store>('stores', MOCK_STORES);
  },

  async getStoresByLocation(cidade: string, estado: string): Promise<Store[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('status', 'active')
        .ilike('cidade', cidade.trim())
        .eq('estado', estado.toUpperCase().trim());
      if (!error && data) return data;
    }
    const stores = getLocalData<Store>('stores', MOCK_STORES);
    return stores.filter(
      s =>
        s.status === 'active' &&
        s.cidade.toLowerCase() === cidade.toLowerCase().trim() &&
        s.estado.toUpperCase() === estado.toUpperCase().trim()
    );
  },

  async addStore(store: Omit<Store, 'id' | 'creditos' | 'avaliacao_media' | 'tempo_resposta'>): Promise<Store> {
    const fullStore: Store = {
      ...store,
      id: Math.random().toString(36).substr(2, 9),
      creditos: 10, // Starting credits
      avaliacao_media: 5.0,
      tempo_resposta: 15,
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('stores')
        .insert([fullStore])
        .select()
        .single();
      if (!error && data) return data;
      throw error || new Error('Failed to insert store');
    }
    const stores = getLocalData<Store>('stores', MOCK_STORES);
    stores.push(fullStore);
    setLocalData('stores', stores);
    return fullStore;
  },

  async updateStore(id: string, updates: Partial<Store>): Promise<Store> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('stores')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
      throw error || new Error('Failed to update store');
    }
    const stores = getLocalData<Store>('stores', MOCK_STORES);
    const idx = stores.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Store not found');
    stores[idx] = { ...stores[idx], ...updates };
    setLocalData('stores', stores);
    return stores[idx];
  },

  // --- UPGRADE REQUESTS ---
  async createUpgradeRequest(request: Omit<UpgradeRequest, 'id' | 'status' | 'created_at'>): Promise<UpgradeRequest> {
    const newRequest: UpgradeRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('upgrade_requests')
        .insert([newRequest])
        .select()
        .single();
      if (!error && data) return data;
      throw error || new Error('Failed to insert upgrade request');
    }
    const requests = getLocalData<UpgradeRequest>('upgrade_requests', []);
    requests.push(newRequest);
    setLocalData('upgrade_requests', requests);
    return newRequest;
  },

  async getUpgradeRequest(id: string): Promise<UpgradeRequest | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('upgrade_requests')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return data;
    }
    const requests = getLocalData<UpgradeRequest>('upgrade_requests', []);
    return requests.find(r => r.id === id) || null;
  },

  async getActiveRequestsForStore(storeId: string): Promise<UpgradeRequest[]> {
    // Get store details to match location
    const stores = await this.getStores();
    const store = stores.find(s => s.id === storeId);
    if (!store) return [];

    // Query upgrade requests in the store's city/state
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('upgrade_requests')
        .select('*')
        .ilike('cidade', store.cidade)
        .eq('estado', store.estado)
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }

    const requests = getLocalData<UpgradeRequest>('upgrade_requests', []);
    return requests
      .filter(
        r =>
          r.cidade.toLowerCase() === store.cidade.toLowerCase() &&
          r.estado.toUpperCase() === store.estado.toUpperCase()
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getAllUpgradeRequests(): Promise<UpgradeRequest[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('upgrade_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as UpgradeRequest[];
    }
    const requests = getLocalData<UpgradeRequest>('upgrade_requests', []);
    return requests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // --- ADMIN LOGS ---
  async addAdminLog(log: Omit<AdminLog, 'id' | 'created_at'>): Promise<AdminLog> {
    const newLog: AdminLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('admin_logs')
        .insert([newLog])
        .select()
        .single();
      if (!error && data) return data as AdminLog;
    }
    const logs = getLocalData<AdminLog>('admin_logs', []);
    logs.push(newLog);
    setLocalData('admin_logs', logs);
    return newLog;
  },

  async getAdminLogs(): Promise<AdminLog[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as AdminLog[];
    }
    const logs = getLocalData<AdminLog>('admin_logs', []);
    return logs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  // --- OFFERS (PROPOSALS) ---
  async getOffersByRequest(requestId: string): Promise<Offer[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('offers')
        .select('*, store:stores(*)')
        .eq('request_id', requestId);
      if (!error && data) return data as Offer[];
    }
    const offers = getLocalData<Offer>('offers', []);
    const stores = await this.getStores();
    return offers
      .filter(o => o.request_id === requestId)
      .map(o => ({
        ...o,
        store: stores.find(s => s.id === o.store_id),
      }));
  },

  async createOffer(offer: Omit<Offer, 'id' | 'status' | 'created_at'>): Promise<Offer> {
    const newOffer: Offer = {
      ...offer,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('offers')
        .insert([newOffer])
        .select()
        .single();
      if (!error && data) return data;
      throw error || new Error('Failed to insert offer');
    }
    const offers = getLocalData<Offer>('offers', []);
    offers.push(newOffer);
    setLocalData('offers', offers);

    // Update upgrade request status if it was pending
    const reqs = getLocalData<UpgradeRequest>('upgrade_requests', []);
    const reqIdx = reqs.findIndex(r => r.id === offer.request_id);
    if (reqIdx !== -1 && reqs[reqIdx].status === 'pending') {
      reqs[reqIdx].status = 'offers_available';
      setLocalData('upgrade_requests', reqs);
    }

    return newOffer;
  },

  async getLojistaOffers(storeId: string): Promise<Offer[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('offers')
        .select('*, request:upgrade_requests(*)')
        .eq('store_id', storeId);
      if (!error && data) return data as Offer[];
    }
    const offers = getLocalData<Offer>('offers', []);
    const requests = getLocalData<UpgradeRequest>('upgrade_requests', []);
    return offers
      .filter(o => o.store_id === storeId)
      .map(o => ({
        ...o,
        request: requests.find(r => r.id === o.request_id),
      }));
  },

  async acceptOffer(offerId: string): Promise<Offer> {
    let acceptedOffer: Offer | null = null;
    let storeId = '';
    let requestId = '';

    if (isSupabaseConfigured && supabase) {
      // Begin transaction style accepts
      const { data: oData, error: oErr } = await supabase
        .from('offers')
        .update({ status: 'accepted' })
        .eq('id', offerId)
        .select()
        .single();
      
      if (oErr || !oData) throw oErr || new Error('Offer not found');
      acceptedOffer = oData as Offer;
      storeId = acceptedOffer.store_id;
      requestId = acceptedOffer.request_id;

      // Reject all other offers for this request
      await supabase
        .from('offers')
        .update({ status: 'rejected' })
        .eq('request_id', requestId)
        .neq('id', offerId);

      // Update upgrade request status
      await supabase
        .from('upgrade_requests')
        .update({ status: 'completed' })
        .eq('id', requestId);

      // Decrement store credits
      const { data: store } = await supabase
        .from('stores')
        .select('creditos')
        .eq('id', storeId)
        .single();
      
      if (store) {
        await supabase
          .from('stores')
          .update({ creditos: Math.max(0, store.creditos - 1) })
          .eq('id', storeId);
        
        // Log credit consumption
        await supabase
          .from('credits')
          .insert([{
            store_id: storeId,
            tipo: 'usage',
            quantidade: -1,
            descricao: `Lead aceito referente ao upgrade ID: ${requestId}`,
          }]);
      }
    } else {
      const offers = getLocalData<Offer>('offers', []);
      const idx = offers.findIndex(o => o.id === offerId);
      if (idx === -1) throw new Error('Offer not found');
      
      offers[idx].status = 'accepted';
      acceptedOffer = offers[idx];
      storeId = acceptedOffer.store_id;
      requestId = acceptedOffer.request_id;

      // Reject others
      offers.forEach(o => {
        if (o.request_id === requestId && o.id !== offerId) {
          o.status = 'rejected';
        }
      });
      setLocalData('offers', offers);

      // Update request status
      const reqs = getLocalData<UpgradeRequest>('upgrade_requests', []);
      const reqIdx = reqs.findIndex(r => r.id === requestId);
      if (reqIdx !== -1) {
        reqs[reqIdx].status = 'completed';
        setLocalData('upgrade_requests', reqs);
      }

      // Update store credits
      const stores = getLocalData<Store>('stores', MOCK_STORES);
      const storeIdx = stores.findIndex(s => s.id === storeId);
      if (storeIdx !== -1) {
        stores[storeIdx].creditos = Math.max(0, stores[storeIdx].creditos - 1);
        setLocalData('stores', stores);

        // Add credit tx
        const txs = getLocalData<CreditTx>('credits', []);
        txs.push({
          id: Math.random().toString(36).substr(2, 9),
          store_id: storeId,
          tipo: 'usage',
          quantidade: -1,
          descricao: `Lead aceito referente ao upgrade ID: ${requestId}`,
          created_at: new Date().toISOString(),
        });
        setLocalData('credits', txs);
      }
    }

    return acceptedOffer!;
  },

  // --- PRICE RULES ---
  async getPriceRules(): Promise<PriceRule[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('price_rules').select('*').eq('status', 'active');
      if (!error && data) return data;
    }
    return getLocalData<PriceRule>('price_rules', MOCK_PRICE_RULES);
  },

  async updatePriceRule(id: string, percentual: number): Promise<PriceRule> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('price_rules')
        .update({ percentual })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data;
      throw error || new Error('Failed to update price rule');
    }
    const rules = getLocalData<PriceRule>('price_rules', MOCK_PRICE_RULES);
    const idx = rules.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('Rule not found');
    rules[idx].percentual = percentual;
    setLocalData('price_rules', rules);
    return rules[idx];
  },

  // --- ADMIN STATS ---
  async getAdminStats() {
    const requests = getLocalData<UpgradeRequest>('upgrade_requests', []);
    const stores = await this.getStores();
    const offers = getLocalData<Offer>('offers', []);

    const acceptedOffersCount = offers.filter(o => o.status === 'accepted').length;
    const conversionRate = requests.length > 0 ? (acceptedOffersCount / requests.length) * 100 : 0;

    const totalVenda = requests.filter(r => !r.modelo_desejado_id).length;
    const totalUpgrade = requests.filter(r => !!r.modelo_desejado_id).length;
    
    const totalValue = requests.reduce((acc, req) => acc + (req.valor_estimado || 0), 0);
    const ticketMedio = requests.length > 0 ? totalValue / requests.length : 0;

    // Calculate top current models (usados)
    const currentModelCounts = requests.reduce((acc, req) => {
      acc[req.modelo_atual_nome] = (acc[req.modelo_atual_nome] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topCurrentModels = Object.entries(currentModelCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    // Calculate top desired models (upgrades)
    const desiredModelCounts = requests.reduce((acc, req) => {
      if (req.modelo_desejado_nome) {
        acc[req.modelo_desejado_nome] = (acc[req.modelo_desejado_nome] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    const topDesiredModels = Object.entries(desiredModelCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    return {
      totalSimulations: requests.length,
      totalVenda,
      totalUpgrade,
      totalValue,
      ticketMedio,
      totalStores: stores.length,
      activeStores: stores.filter(s => s.status === 'active').length,
      pendingStores: stores.filter(s => s.status === 'pending').length,
      totalProposals: offers.length,
      conversionRate: Math.round(conversionRate * 10) / 10,
      pendingOffers: requests.filter(r => r.status === 'pending').length,
      topCurrentModels,
      topDesiredModels,
    };
  },

  // --- LOJISTA STATS ---
  async getLojistaStats(storeId: string): Promise<{ creditos: number; recebidas: number; enviadas: number; aceitas: number; avaliacao_media: number }> {
    const stores = await this.getStores();
    const store = stores.find(s => s.id === storeId);
    if (!store) return { creditos: 0, recebidas: 0, enviadas: 0, aceitas: 0, avaliacao_media: 0 };

    const activeRequests = await this.getActiveRequestsForStore(storeId);
    const offers = getLocalData<Offer>('offers', []);
    const storeOffers = offers.filter(o => o.store_id === storeId);

    return {
      creditos: store.creditos,
      recebidas: activeRequests.length,
      enviadas: storeOffers.length,
      aceitas: storeOffers.filter(o => o.status === 'accepted').length,
      avaliacao_media: store.avaliacao_media ?? 0,
    };
  },

  // --- LOJISTA CREDITS ---
  async getLojistaCreditsHistory(storeId: string): Promise<CreditTx[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('credits')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });
      if (!error && data) return data as CreditTx[];
    }
    const credits = getLocalData<CreditTx>('credits', []);
    return credits
      .filter(c => c.store_id === storeId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async addCreditsToStore(storeId: string, amount: number): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { data: store } = await supabase
        .from('stores')
        .select('creditos')
        .eq('id', storeId)
        .single();
      
      if (store) {
        await supabase
          .from('stores')
          .update({ creditos: store.creditos + amount })
          .eq('id', storeId);
        
        await supabase
          .from('credits')
          .insert([{
            store_id: storeId,
            tipo: 'purchase',
            quantidade: amount,
            descricao: `Compra de ${amount} créditos via painel`,
          }]);
      }
    } else {
      const stores = getLocalData<Store>('stores', MOCK_STORES);
      const storeIdx = stores.findIndex(s => s.id === storeId);
      if (storeIdx !== -1) {
        stores[storeIdx].creditos += amount;
        setLocalData('stores', stores);

        const txs = getLocalData<CreditTx>('credits', []);
        txs.push({
          id: Math.random().toString(36).substr(2, 9),
          store_id: storeId,
          tipo: 'purchase',
          quantidade: amount,
          descricao: `Compra de ${amount} créditos via painel`,
          created_at: new Date().toISOString(),
        });
        setLocalData('credits', txs);
      }
    }
  }
};
