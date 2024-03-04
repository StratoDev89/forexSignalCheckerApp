import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Pairs } from '../models/pairs';
import { OptionsParams, TimeSeries } from '../models/time.series';
import { tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PairsService {
  private http = inject(HttpClient);
  private apiKey = inject(AuthService).getApiKey()
  private apiUrl = environment.API_URL;
  private headers = new HttpHeaders({ 'X-RapidAPI-Key': this.apiKey });
  constructor() {}

  getPairs() {
    return this.http.get<Pairs>(`${this.apiUrl}/forex_pairs`, {
      headers: this.headers,
    });
  }

  getTimeSeries(options: OptionsParams) {
    const params = new HttpParams()
      .set('symbol', options.symbol)
      .set('interval', options.interval)
      .set('outputsize', options.outputsize);

    return this.http
      .get<TimeSeries>(`${this.apiUrl}/time_series`, {
        headers: this.headers,
        params: params,
      })
      .pipe(
        tap((data) => {
          data.values.reverse();
        })
      );
  }
}
