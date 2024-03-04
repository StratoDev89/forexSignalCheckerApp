export interface Pairs {
  data: Data[];
}

export interface Data {
  symbol: string;
  currency_group: string;
  currency_base: string;
  currency_quote: string;
}
