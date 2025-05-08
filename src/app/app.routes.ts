import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArticleComponent } from './article/article.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Default route
  { path: 'home', component: HomeComponent },  // Explicit home route
  { path: 'article', component: ArticleComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }  // Redirect any unknown paths to home
];
