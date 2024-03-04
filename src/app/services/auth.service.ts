import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  value = 'API_KEY';

  setApiKey(apiKey: string) {
    localStorage.setItem(this.value, apiKey);
  }

  getApiKey(): string | null {
    return localStorage.getItem(this.value) ?? null;
  }

  removeApiKey() {
    localStorage.removeItem(this.value);
  }
}
