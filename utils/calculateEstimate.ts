import { IphoneModel } from '@/lib/mockData';

export interface EstimateResult {
  valorEstimado: number;
  precoDesejado: number;
  diferencaMedia: number;
  diferencaMin: number;
  diferencaMax: number;
}

export function calculateUpgradeEstimate(
  currentModel: IphoneModel | null,
  desiredModel: IphoneModel | null,
  condition: 'excelente' | 'bom' | 'marcas' | 'tela_quebrada' | null,
  hasRepaired: 'sim' | 'nao' | 'nao_sei' | null
): EstimateResult {
  if (!currentModel) {
    return {
      valorEstimado: 0,
      precoDesejado: 0,
      diferencaMedia: 0,
      diferencaMin: 0,
      diferencaMax: 0,
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

  // Estimate calculation
  const calculatedEstimate = baseValue * conditionMultiplier * repairMultiplier;
  
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
    };
  }

  // Desired phone price
  const precoDesejado = desiredModel.preco_medio_novo;

  // Difference calculation
  const rawDifference = precoDesejado - valorEstimado;
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
  };
}
