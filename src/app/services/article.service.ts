import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:5053/home';
  private httpsUrl = 'https://localhost:7036/home';

  constructor(private http: HttpClient) { }

  getArticle(): Observable<any> {
    var url: string = `${this.apiUrl}/article`;
    return this.http.get<any>(url);//`${this.apiUrl}/article`);
  }
}
