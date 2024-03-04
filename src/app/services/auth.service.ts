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

  getApiKey(): string {
    return localStorage.getItem(this.value) ?? '';
  }

  removeApiKey() {
    localStorage.removeItem(this.value);
  }
}
