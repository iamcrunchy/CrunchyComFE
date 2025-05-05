import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router'; // Import specific directives
// Or you could import the whole module: import { RouterModule } from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common'; // Often needed for *ngIf, *ngFor, etc. (might not be strictly necessary for *this* simple nav, but good practice)

@Component({
  selector: 'app-nav-menu',
  standalone: true, // Mark the component as standalone
  imports: [
    CommonModule,
    RouterLink,        // Import RouterLink directive
    RouterLinkActive,
    NgOptimizedImage,
    // Import RouterLinkActive directive
    // RouterModule // Alternatively, importing the whole module works too
  ], // Import necessary modules/directives directly
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css'] // Or .css
})
export class NavMenuComponent {
  // Component logic (if any) goes here
}
