import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PairsService } from './services/pairs.service';
import { Interval } from './models/time.series';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { ForexSignal, TradeType } from './models/signal';
import { format } from 'date-fns';
import { SignalComponent } from './components/signal/signal.component';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { v4 as uuidv4 } from 'uuid';
import { SignalStorageService } from './services/signal-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
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
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'forexApp';

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
    this.authService.setApiKey(environment.API_KEY);
    this.signalStorageService.$data.subscribe((data) => {
      this.signalsStorage.set(data);
      console.log(data);

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

// signalsMock = signal<ForexSignal[]>([
//   {
//     id: uuidv4(),
//     pair: 'XAU/USD',
//     entryPrice: 2027,
//     stopLoss: 2018,
//     takeProfit: 2037,
//     tradeType: 'BUY',
//     status: null,
//     entryDate: format(new Date(2024, 1, 21), 'yyyy-MM-dd'),
//     interval: '1day',
//   },

//   {
//     id: uuidv4(),
//     pair: 'XAU/USD',
//     entryPrice: 2023,
//     stopLoss: 2040,
//     takeProfit: 1979,
//     tradeType: 'SELL',
//     status: null,
//     entryDate: format(new Date(2024, 1, 12), 'yyyy-MM-dd'),
//     interval: '1day',
//   },
// ]);
