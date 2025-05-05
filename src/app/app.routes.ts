import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArticleComponent } from './article/article.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },  // Default route
  { path: 'home', component: HomeComponent },  // Explicit home route
  { path: 'article', component: ArticleComponent },
  { path: '**', redirectTo: '' }  // Redirect any unknown paths to home
];
