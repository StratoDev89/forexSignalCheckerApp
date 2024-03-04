import { Routes } from '@angular/router';
import { ReadmeComponent } from './pages/readme/readme.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'readme', component: ReadmeComponent },
];
