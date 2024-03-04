import { Component, inject, signal } from '@angular/core';
import { PairsService } from '../../services/pairs.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { ForexSignal, TradeType } from '../../models/signal';
import { AuthService } from '../../services/auth.service';
import { SignalStorageService } from '../../services/signal-storage.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SignalComponent } from '../../components/signal/signal.component';
import { v4 as uuidv4 } from 'uuid';
import { Interval } from '../../models/time.series';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SignalComponent,
    MatSlideToggleModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  pairsService = inject(PairsService);
  authService = inject(AuthService);
  signalStorageService = inject(SignalStorageService);
  reqStatus = signal<'success' | 'failed' | ''>('');
  intervals = ['1min', '15min', '30min', '45min', '1h', '2h', '4h', '1day'];

  signalsStorage = signal<ForexSignal[]>([]);

  form = new FormGroup({
    pair: new FormControl(''),
    entryPrice: new FormControl(''),
    stopLoss: new FormControl(''),
    takeProfit: new FormControl(''),
    tradeType: new FormControl<'BUY' | 'SELL' | null>(null),
    entryDate: new FormControl(''),
    interval: new FormControl(''),
  });

  ngOnInit() {
    this.signalStorageService.$data.subscribe((data) => {
      this.signalsStorage.set(data);
    });
  }

  addSignal() {
    const id = uuidv4();
    const pair = this.form.get('pair')!.value;
    const entryPrice = Number(this.form.get('entryPrice')!.value);
    const stopLoss = Number(this.form.get('stopLoss')!.value);
    const takeProfit = Number(this.form.get('takeProfit')!.value);
    const tradeType = this.form.get('tradeType')!.value as TradeType;
    const entryDate = this.form.get('entryDate')!.value as unknown;
    const interval = this.form.get('interval')!.value as Interval;

    const signalToAdd: ForexSignal = {
      id,
      pair,
      entryPrice,
      stopLoss,
      takeProfit,
      tradeType,
      status: null,
      entryDate: format(entryDate as Date, 'yyyy-MM-dd'),
      interval,
    };

    this.signalStorageService.setSignal(signalToAdd);
  }
}
