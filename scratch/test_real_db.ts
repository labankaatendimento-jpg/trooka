import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irouregsafylipfekfqg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlyb3VyZWdzYWZ5bGlwZmVrZnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMDAwMDEsImV4cCI6MjEwMzc3NjAwMX0.ZFkowY5Hwlq69PnQiOeBSufNEkatDAdJZtM3CQ9J-qs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testRealDB() {
  const { data, error } = await supabase
    .from('iphone_models')
    .select('*')
    .eq('status', 'active');
    
  if (error) {
    console.error(error);
    return;
  }
  
  const sortModels = (arr) => {
    return [...arr].sort((a, b) => {
      // 1. Sort by Generation (17, 16, 15...) descending
      const getGen = (name) => {
        const match = name.match(/(11|12|13|14|15|16|17|18|19|20)/);
        return match ? parseInt(match[1]) : 0;
      };
      const genA = getGen(a.modelo);
      const genB = getGen(b.modelo);
      if (genA !== genB) return genB - genA;

      // 2. Sort by Tier ascending
      const getTier = (m) => {
        const lower = m.trim().toLowerCase();
        if (lower.includes('pro max')) return 5;
        if (lower.includes('pro')) return 4;
        if (lower.includes('plus') || lower.includes('air')) return 3;
        if (lower.includes('mini') || lower.match(/\be\b/) || lower.match(/\d+e\b/) || lower.includes('se')) return 1;
        return 2;
      };
      const tierA = getTier(a.modelo);
      const tierB = getTier(b.modelo);
      if (tierA !== tierB) return tierA - tierB;
      
      // 3. Sort by Storage ascending
      const parseStorage = (s) => {
        if (!s) return 0;
        if (s.toUpperCase().includes('TB')) return parseInt(s) * 1024;
        return parseInt(s) || 0;
      };
      return parseStorage(a.armazenamento) - parseStorage(b.armazenamento);
    });
  };

  const sorted = sortModels(data);
  sorted.forEach(m => console.log(`${m.modelo} ${m.armazenamento} (Gen: ${m.modelo.match(/(11|12|13|14|15|16|17|18|19|20)/)?.[1] || 0})`));
}

testRealDB();
