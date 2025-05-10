import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../models/post.interface';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  postForm: FormGroup;
  previewHtml: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: [''],
      published: [false]
    });
  }

  generatePreview() {
    // This will be implemented with the backend service
    // For now, just show the raw content
    this.previewHtml = this.postForm.get('content')?.value;
  }

  onSubmit() {
    if (this.postForm.valid) {
      const formValue = this.postForm.value;
      const post: Post = {
        title: formValue.title,
        content: formValue.content,
        author: 'Admin', // This should come from auth service
        tags: formValue.tags.split(',').map((tag: string) => tag.trim()),
        published: formValue.published
      };

      // TODO: Implement save functionality
      console.log('Saving post:', post);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
