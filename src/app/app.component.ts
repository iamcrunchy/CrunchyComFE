import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CrunchyCom - A Learning Experience';


}
