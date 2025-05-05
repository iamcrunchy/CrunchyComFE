import { Component } from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';
import {NavMenuComponent} from './shared/components/nav-menu/nav-menu.component';
// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CrunchyCom - A Learning Experience';


}
