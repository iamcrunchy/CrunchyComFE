import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  error = '';
  // returnUrl: string = '/admin';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize the login form
    this.loginForm = this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });}

  ngOnInit(): void {
    // Extract and clean up the returnUrl
    let returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';

    // Handle the nested returnUrl case
    // if (returnUrl.includes('returnUrl=')) {
    //   const match = returnUrl.match(/returnUrl=([^&]+)/);
    //   if (match && match[1]) {
    //     returnUrl = decodeURIComponent(match[1]);
    //   }
    // }
    //
    // Prevent potential login loops by checking if we're being redirected to login again
    if (returnUrl.includes('/login')) {
      returnUrl = '/admin';
    }
    //
    // this.returnUrl = returnUrl;
    //
    // If already authenticated, navigate immediately
    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl('/admin');
      return;
    }

    if(this.authService.isAuthenticated) {
      this.router.navigateByUrl('/admin');
    }
  }

  /**
   * Handles form submission for login.
   * Validates the form, sends login request, and handles navigation on success.
   */
  onSubmit(): void {
    // Don't proceed if form is invalid
    if (this.loginForm.invalid) {
      this.error = 'Please fill in all required fields correctly.';
      // Mark all fields as touched to display validation messages
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    // getting raw value of form grabs disabled controls too
    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: (success: any) =>  {
        this.loading = false;
        if(success) {
          this.router.navigate(['/admin']);
        } else {
          this.error = "Authentication failed. Please try again.";
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = "An unexpected error occurred. Please try again.";
        console.error('Error logging in:', err);
      }
    });
  }
}
