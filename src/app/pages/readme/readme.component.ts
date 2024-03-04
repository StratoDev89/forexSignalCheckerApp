import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-readme',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './readme.component.html',
  styleUrl: './readme.component.scss',
})
export class ReadmeComponent {
  authService = inject(AuthService);

  status = signal<'notSaved' | 'saved'>('notSaved');

  apiForm = new FormGroup({
    apiKey: new FormControl('', Validators.required),
  });

  ngOnInit() {
    const storageApiKey = this.authService.getApiKey();
    if (storageApiKey) this.status.set('saved');
  }

  onSave() {
    const apiKeyValue = this.apiForm.get('apiKey')?.value;

    if (this.apiForm.invalid || apiKeyValue === null) {
      this.apiForm.markAllAsTouched();
      return;
    }

    this.authService.setApiKey(apiKeyValue!);
    this.status.set('saved');
  }
}
