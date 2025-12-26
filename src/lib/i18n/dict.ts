export type Locale = 'pt' | 'en';

export type Dict = {
  appName: string;
  openCalculator: string;
  tagline: string;
  calculator: string;
  input: string;
  result: string;
  clear: string;
  clearAll: string;
  equals: string;
  plusMinus: string;
  unit: string;
  precision: string;
  setRise: string;
  setRun: string;
  setPitch: string;
  calcPitch: string;
  calcRise: string;
  calcRun: string;
  calcDiag: string;
  conv: string;
  stairs: string;
  apiError: string;
};

export const DICT: Record<Locale, Dict> = {
  en: {
    appName: 'Construction Calculator',
    openCalculator: 'Open Calculator',
    tagline:
      'A responsive construction calculator with pitch, rise/run, diagonal, conversions, and stairs (MVP).',
    calculator: 'Calculator',
    input: 'Input',
    result: 'Result',
    clear: 'Clear',
    clearAll: 'Clear All',
    equals: '=',
    plusMinus: '+/-',
    unit: 'Unit',
    precision: 'Precision',
    setRise: 'Rise',
    setRun: 'Run',
    setPitch: 'Pitch',
    calcPitch: 'Pitch',
    calcRise: 'Rise',
    calcRun: 'Run',
    calcDiag: 'Diag',
    conv: 'Conv',
    stairs: 'Stair',
    apiError: 'API error',
  },
  pt: {
    appName: 'Calculadora de Construção',
    openCalculator: 'Abrir Calculadora',
    tagline: 'Calculadora responsiva com pitch, rise/run, diagonal, conversões e escada (MVP).',
    calculator: 'Calculadora',
    input: 'Entrada',
    result: 'Resultado',
    clear: 'Limpar',
    clearAll: 'Limpar Tudo',
    equals: '=',
    plusMinus: '+/-',
    unit: 'Unidade',
    precision: 'Precisão',
    setRise: 'Rise',
    setRun: 'Run',
    setPitch: 'Pitch',
    calcPitch: 'Pitch',
    calcRise: 'Rise',
    calcRun: 'Run',
    calcDiag: 'Diag',
    conv: 'Conv',
    stairs: 'Escada',
    apiError: 'Erro na API',
  },
};
