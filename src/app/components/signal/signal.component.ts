import { Component, inject, input, signal } from '@angular/core';
import { ForexSignal, TradeStatus } from '../../models/signal';
import { PairsService } from '../../services/pairs.service';
import { eachDayOfInterval, format, isSunday, isSaturday } from 'date-fns';
import { Interval, OptionsParams, Value } from '../../models/time.series';
import { MatButtonModule } from '@angular/material/button';
import { SignalStorageService } from '../../services/signal-storage.service';

export interface ValidationOptions {
  takeProfit: number;
  stopLoss: number;
  highPrice: number;
  lowPrice: number;
}

@Component({
  selector: 'app-signal',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './signal.component.html',
  styleUrl: './signal.component.scss',
})
export class SignalComponent {
  reqStatus = signal<'success' | 'failed' | ''>('');
  forexSignal = input.required<ForexSignal>();
  pairsService = inject(PairsService);
  signalStorageService = inject(SignalStorageService);

  async checkSignal() {
    const { stopLoss, takeProfit, tradeType } = this.forexSignal();

    try {
      const values = await this.getTimeSeries(this.forexSignal());
      const filteredValues = this.filterValues(values);

      let status!: TradeStatus;

      for (const value of filteredValues) {
        const options: ValidationOptions = {
          stopLoss: stopLoss!,
          takeProfit: takeProfit!,
          highPrice: Number(value.high),
          lowPrice: Number(value!.low),
        };

        if (tradeType === 'BUY') {
          status = this.buyValidation(options);
        }

        if (tradeType === 'SELL') {
          status = this.sellValidation(options);
        }

        if (status !== 'RUNNING') {
          this.forexSignal().status = status;
          return;
        }
      }
      this.forexSignal().status = 'RUNNING';

      return;
    } catch (error) {
      this.reqStatus.set('failed');
    }
  }

  async getTimeSeries(signal: ForexSignal): Promise<Value[]> {
    const [year, month, day] = signal.entryDate!.split('-').map(Number);
    const entryDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    const allDays = eachDayOfInterval({ start: entryDate, end: currentDate });
    const filteredSunday = allDays.filter((day) => !isSunday(day));
    const filteredSaturdays = filteredSunday.filter((day) => !isSaturday(day));

    const outputSize = this.getOutputSize(
      signal.interval!,
      filteredSaturdays.length
    );

    const options: OptionsParams = {
      symbol: signal.pair!,
      interval: signal.interval!,
      outputsize: outputSize,
    };

    return new Promise((resolve, reject) => {
      this.pairsService.getTimeSeries(options).subscribe({
        next: (data) => {
          resolve(data.values);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  filterValues(values: Value[]) {
    const filteredValues: Value[] = [];

    values.forEach((value) => {
      const offsetInMinutes = new Date().getTimezoneOffset();
      const localDate = new Date(value.datetime);
      const date = new Date(localDate.getTime() + offsetInMinutes * 60 * 1000);
      const dayOfWeek = format(date, 'EEE');

      if (dayOfWeek !== 'Sat') {
        filteredValues.push(value);
      }
    });

    return filteredValues;
  }

  buyValidation(options: ValidationOptions): TradeStatus {
    const { stopLoss, takeProfit, highPrice, lowPrice } = options;

    if (lowPrice < stopLoss && highPrice > takeProfit) return 'UNDEFINED';
    if (lowPrice < stopLoss) return 'SL HIT';
    if (highPrice > takeProfit) return 'TP HIT';

    return 'RUNNING';
  }

  sellValidation(options: ValidationOptions): TradeStatus {
    const { stopLoss, takeProfit, highPrice, lowPrice } = options;

    if (lowPrice < takeProfit && highPrice > stopLoss) return 'UNDEFINED';
    if (highPrice > stopLoss) return 'SL HIT';
    if (lowPrice < takeProfit) return 'TP HIT';

    return 'RUNNING';
  }

  getOutputSize(interval: Interval, daysLenght: number): number {
    const intervalMap = {
      '1min': 1,
      '5min': 5,
      '15min': 15,
      '30min': 30,
      '45min': 45,
      '1h': 60,
      '2h': 120,
      '4h': 240,
      '1day': 1440,
    };
    const minutesPerDay = 1440;

    switch (interval) {
      case '4h':
        const output4h = (minutesPerDay / intervalMap['4h']) * daysLenght;
        return output4h;

      case '2h':
        const output2h = (minutesPerDay / intervalMap['2h']) * daysLenght;
        return output2h;

      case '1h':
        const output1h = (minutesPerDay / intervalMap['1h']) * daysLenght;
        return output1h;

      case '45min':
        const output45m = (minutesPerDay / intervalMap['45min']) * daysLenght;
        return output45m;

      case '30min':
        const output30m = (minutesPerDay / intervalMap['30min']) * daysLenght;
        return output30m;

      case '15min':
        const output15m = (minutesPerDay / intervalMap['15min']) * daysLenght;
        return output15m;

      case '5min':
        const output5m = (minutesPerDay / intervalMap['5min']) * daysLenght;
        return output5m;

      default:
        return daysLenght;
    }
  }

  deleteSignal() {
    const id = this.forexSignal().id;
    this.signalStorageService.deleteSignal(id);
  }
}
