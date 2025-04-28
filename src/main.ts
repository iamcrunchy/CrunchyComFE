import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import {ArticleComponent} from './app/article/article.component';
import {provideHttpClient} from '@angular/common/http';


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter([
      { path: 'article', component: ArticleComponent }, // Route for the article
      { path: '', redirectTo: 'article', pathMatch: 'full' }, // Default route
      { path: '**', redirectTo: 'article' } // Wildcard route for unmatched paths
    ])
  ]
});
