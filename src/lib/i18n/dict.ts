export type Locale = "pt" | "en";

export type DictKey =
  | "appName"
  | "openCalculator"
  | "landingTitle"
  | "landingSubtitle"
  | "calculatorTitle"
  | "modePitch"
  | "modeRise"
  | "modeRun"
  | "modeDiag"
  | "modeConvert"
  | "modeStairs"
  | "fieldRise"
  | "fieldRun"
  | "fieldPitch"
  | "fieldValue"
  | "fieldTotalRise"
  | "fieldDesiredRise"
  | "fieldDesiredTread"
  | "inUnit"
  | "outUnit"
  | "precision"
  | "calculate"
  | "clear"
  | "clearAll";

export const dict: Record<Locale, Record<DictKey, string>> = {
  pt: {
    appName: "Construction Master Web",
    openCalculator: "Abrir Calculadora",
    landingTitle: "Calculadora de obra no navegador",
    landingSubtitle:
      "Clone e expansão da calculadora estilo Construction Master (pitch/rise/run/diag, conversões, escadas).",
    calculatorTitle: "Calculadora",
    modePitch: "Pitch",
    modeRise: "Rise",
    modeRun: "Run",
    modeDiag: "Diag",
    modeConvert: "Conv",
    modeStairs: "Stair",
    fieldRise: "Rise",
    fieldRun: "Run",
    fieldPitch: "Pitch (X/12)",
    fieldValue: "Valor",
    fieldTotalRise: "Total Rise",
    fieldDesiredRise: "Rise/Step",
    fieldDesiredTread: "Tread",
    inUnit: "Unid. Entrada",
    outUnit: "Unid. Saída",
    precision: "Precisão (denom.)",
    calculate: "Calcular",
    clear: "Clear",
    clearAll: "Clear All",
  },
  en: {
    appName: "Construction Master Web",
    openCalculator: "Open Calculator",
    landingTitle: "Construction calculator in your browser",
    landingSubtitle:
      "Clone + expansion of the Construction Master style calculator (pitch/rise/run/diag, conversions, stairs).",
    calculatorTitle: "Calculator",
    modePitch: "Pitch",
    modeRise: "Rise",
    modeRun: "Run",
    modeDiag: "Diag",
    modeConvert: "Conv",
    modeStairs: "Stair",
    fieldRise: "Rise",
    fieldRun: "Run",
    fieldPitch: "Pitch (X/12)",
    fieldValue: "Value",
    fieldTotalRise: "Total Rise",
    fieldDesiredRise: "Rise/Step",
    fieldDesiredTread: "Tread",
    inUnit: "In unit",
    outUnit: "Out unit",
    precision: "Precision (denom.)",
    calculate: "Calculate",
    clear: "Clear",
    clearAll: "Clear All",
  },
};

