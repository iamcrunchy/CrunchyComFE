import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArticleComponent } from './article/article.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Default route
  { path: 'home', component: HomeComponent },  // Explicit home route
  { path: 'article', component: ArticleComponent },
  { path: 'admin', component: AdminComponent},
  { path: '**', redirectTo: '' }  // Redirect any unknown paths to home
];
