export interface DataPoint {
  date: string;
  value: number;
}

export interface EconomicData {
  gdp: DataPoint[] | null;
  unemployment: DataPoint[] | null;
  inflation: DataPoint[] | null;
  interestRate: DataPoint[] | null;
  housing: DataPoint[] | null;
  spending: DataPoint[] | null;
  exchangeRate: DataPoint[] | null;
}

export type IndicatorType = keyof EconomicData;
