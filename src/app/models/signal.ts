import { Interval } from "./time.series";

export interface ForexSignal {
  id: string;
  pair: string | null;
  entryPrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  tradeType: TradeType ;
  status: TradeStatus | null;
  entryDate: string | null
  interval: Interval | null
}

export type TradeStatus = 'TP HIT' | 'SL HIT' | 'UNDEFINED' | 'RUNNING';
export type TradeType = 'BUY' | 'SELL';
