import { IphoneModel, PriceRule } from '@/lib/mockData';

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
  desiredCondition?: 'novo' | 'seminovo' | null,
  rules?: PriceRule[]
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

  // Helper for dynamic rules
  const getRulePercentual = (nome: string, defaultPercentual: number) => {
    if (!rules || rules.length === 0) return defaultPercentual;
    const rule = rules.find(r => r.nome === nome);
    return rule ? rule.percentual : defaultPercentual;
  };

  // Multiplier for condition
  let conditionMultiplier = 1.0;
  let ruleName: string = condition || 'bom';
  if (condition === 'excelente') { conditionMultiplier = getRulePercentual('Estado: Excelente', 1.0); ruleName = 'Excelente'; }
  else if (condition === 'bom') { conditionMultiplier = getRulePercentual('Estado: Bom', 0.85); ruleName = 'Bom'; }
  else if (condition === 'marcas') { conditionMultiplier = getRulePercentual('Estado: Usado', 0.65); ruleName = 'Usado'; }
  else if (condition === 'tela_quebrada') { conditionMultiplier = getRulePercentual('Estado: Danificado', 0.35); ruleName = 'Danificado'; }

  // Multiplier for repair history
  let repairMultiplier = 1.0;
  if (hasRepaired === 'sim') repairMultiplier = getRulePercentual('Reparo: Já foi reparado', 0.85);

  // Multiplier for battery health
  let batteryMultiplier = 1.0;
  if (batteryCondition === '90-100') batteryMultiplier = getRulePercentual('Bateria: 90 - 100%', 1.0);
  else if (batteryCondition === '80-89') batteryMultiplier = getRulePercentual('Bateria: 80 - 89%', 0.95);
  else if (batteryCondition === 'below-80') batteryMultiplier = getRulePercentual('Bateria: Abaixo de 80%', 0.85);

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
        regra_estado_nome: ruleName,
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
      regra_estado_nome: ruleName,
      regra_estado_multiplicador: conditionMultiplier,
    }
  };
}
