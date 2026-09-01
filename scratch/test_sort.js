const models = [
  { modelo: 'iPhone 17', armazenamento: '128GB' },
  { modelo: 'iPhone 17 E', armazenamento: '128GB' },
  { modelo: 'iPhone 16', armazenamento: '128GB' },
  { modelo: 'iPhone 16e', armazenamento: '128GB' },
  { modelo: 'iPhone 15 Pro', armazenamento: '128GB' }
];

const sortModels = (arr) => {
  return [...arr].sort((a, b) => {
    // 1. Generation (descending)
    const getGen = (name) => {
      const match = name.match(/(11|12|13|14|15|16|17|18|19|20)/);
      return match ? parseInt(match[1]) : 0;
    };
    const genA = getGen(a.modelo);
    const genB = getGen(b.modelo);
    if (genA !== genB) return genB - genA;

    // 2. Tier (ascending)
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
    
    // 3. Storage (ascending)
    const parseStorage = (s) => {
      if (s.toUpperCase().includes('TB')) return parseInt(s) * 1024;
      return parseInt(s) || 0;
    };
    return parseStorage(a.armazenamento) - parseStorage(b.armazenamento);
  });
};

console.log(sortModels(models));
