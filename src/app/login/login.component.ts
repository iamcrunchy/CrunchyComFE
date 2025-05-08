import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import { Router } from '@angular/router';
import {finalize} from 'rxjs';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    NgClass,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void{
    if(this.loginForm.invalid){
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value)
      .pipe(
        finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          // navigate to protected route on success
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.error = err.message || "Authentication failed. Please try again.";
        }
      });
  }
}
