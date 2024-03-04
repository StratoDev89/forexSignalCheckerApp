import { Injectable, signal } from '@angular/core';
import { ForexSignal } from '../models/signal';
import { toObservable } from '@angular/core/rxjs-interop';
@Injectable({
  providedIn: 'root',
})
export class SignalStorageService {
  constructor() {}

  private value = 'SIGNALS';

  private data = signal<ForexSignal[]>(this.getSignals());
  $data = toObservable(this.data);

  setSignal(signal: ForexSignal) {
    const currentData = this.getSignals();
    currentData.unshift(signal);
    localStorage.setItem(this.value, JSON.stringify(currentData));
    this.data.set(this.getSignals());
  }

  private getSignals(): ForexSignal[] {
    const data = localStorage.getItem(this.value);
    return data ? JSON.parse(data) : [];
  }

  deleteSignal(signalId: string) {
    const currentData = this.getSignals();
    const data = currentData.filter((signal) => signal.id !== signalId);
    localStorage.setItem(this.value, JSON.stringify(data));
    this.data.set(this.getSignals());
  }
}
