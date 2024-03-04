export interface TimeSeries {
  meta: Meta;
  values: Value[];
  status: string;
}

export interface Meta {
  symbol: string;
  interval: string;
  currency_base: string;
  currency_quote: string;
  type: string;
}

export interface Value {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

export interface OptionsParams {
  symbol: string;
  interval: Interval;
  outputsize: number;
}

export type Interval =
  | '1min'
  | '5min'
  | '15min'
  | '30min'
  | '45min'
  | '1h'
  | '2h'
  | '4h'
  | '1day'

