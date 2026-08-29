import { IphoneModel } from '@/lib/mockData';

export interface EstimateResult {
  valorEstimado: number;
  precoDesejado: number;
  diferencaMedia: number;
  diferencaMin: number;
  diferencaMax: number;
  snapshot?: {
    preco_mercado_usado: number;
    preco_mercado_novo: number;
    valor_base_upgrade: number;
    regra_estado_nome: string;
    regra_estado_multiplicador: number;
  };
}

export function calculateUpgradeEstimate(
  currentModel: IphoneModel | null,
  desiredModel: IphoneModel | null,
  condition: 'excelente' | 'bom' | 'marcas' | 'tela_quebrada' | null,
  hasRepaired: 'sim' | 'nao' | 'nao_sei' | null,
  batteryCondition?: '90-100' | '80-89' | 'below-80' | null,
  desiredCondition?: 'novo' | 'seminovo' | null
): EstimateResult {
  if (!currentModel) {
    return {
      valorEstimado: 0,
      precoDesejado: 0,
      diferencaMedia: 0,
      diferencaMin: 0,
      diferencaMax: 0,
      snapshot: undefined,
    };
  }

  // Base trade-in value from DB
  const baseValue = currentModel.valor_base_upgrade;

  // Multiplier for condition
  let conditionMultiplier = 1.0;
  if (condition === 'excelente') conditionMultiplier = 1.0;
  else if (condition === 'bom') conditionMultiplier = 0.85; // 15% de desvalorização
  else if (condition === 'marcas') conditionMultiplier = 0.65; // 35% de desvalorização
  else if (condition === 'tela_quebrada') conditionMultiplier = 0.35; // 65% de desvalorização

  // Multiplier for repair history
  let repairMultiplier = 1.0;
  if (hasRepaired === 'sim') repairMultiplier = 0.85;

  // Multiplier for battery health
  let batteryMultiplier = 1.0;
  if (batteryCondition === '80-89') batteryMultiplier = 0.95; // 5% de desvalorização
  else if (batteryCondition === 'below-80') batteryMultiplier = 0.85; // 15% de desvalorização

  // Estimate calculation
  const calculatedEstimate = baseValue * conditionMultiplier * repairMultiplier * batteryMultiplier;
  
  // Round to nearest R$ 50 for clean appearance
  const valorEstimado = Math.round(calculatedEstimate / 50) * 50;

  // If no desired model, just return the device value estimate
  if (!desiredModel) {
    return {
      valorEstimado,
      precoDesejado: 0,
      diferencaMedia: 0,
      diferencaMin: 0,
      diferencaMax: 0,
      snapshot: {
        preco_mercado_usado: currentModel.preco_medio_usado,
        preco_mercado_novo: currentModel.preco_medio_novo,
        valor_base_upgrade: baseValue,
        regra_estado_nome: condition || 'bom',
        regra_estado_multiplicador: conditionMultiplier,
      }
    };
  }

  // Desired phone price
  // Default to novo if not specified or not applicable
  const isSeminovo = desiredCondition === 'seminovo';
  
  // Base values for desired phone
  // MOCK_IPHONE_MODELS usually have 0 for future models' used price, so fallback to novo if used is 0
  let precoDesejado = isSeminovo && desiredModel.preco_medio_usado > 0 
    ? desiredModel.preco_medio_usado 
    : desiredModel.preco_medio_novo;

  // Difference calculation
  const rawDifference = Math.max(0, precoDesejado - valorEstimado);
  const diferencaMedia = Math.round(rawDifference / 50) * 50;

  // Create range around difference (e.g. +/- R$ 200)
  const diferencaMin = Math.round((rawDifference - 200) / 100) * 100;
  const diferencaMax = Math.round((rawDifference + 200) / 100) * 100;

  return {
    valorEstimado,
    precoDesejado,
    diferencaMedia,
    diferencaMin,
    diferencaMax,
    snapshot: {
      preco_mercado_usado: currentModel.preco_medio_usado,
      preco_mercado_novo: currentModel.preco_medio_novo,
      valor_base_upgrade: baseValue,
      regra_estado_nome: condition || 'bom',
      regra_estado_multiplicador: conditionMultiplier,
    }
  };
}
