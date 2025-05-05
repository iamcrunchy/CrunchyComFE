import { Component, OnInit } from '@angular/core';
import { ArticleService} from '../services/article.service';
import {DatePipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    DatePipe,
    NgIf
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  article: any = null;

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    // Fetch the article when the component initializes
    this.articleService.getArticle().subscribe({
      next: (data) => {
        this.article = data;
      },
      error: (err) => {
        console.error('Error fetching article:', err);
      }
    });
  }

}

