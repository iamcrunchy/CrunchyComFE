import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../models/post.interface';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="admin-container">
      <h2>Admin Dashboard</h2>

      <div class="post-form-container">
        <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Title</label>
            <input
              type="text"
              id="title"
              formControlName="title"
              class="form-control"
              placeholder="Enter post title">
          </div>

          <div class="form-group">
            <label for="content">Content (Markdown)</label>
            <textarea
              id="content"
              formControlName="content"
              class="form-control markdown-editor"
              rows="15"
              placeholder="Write your post in Markdown"></textarea>
          </div>

          <div class="form-group">
            <label for="tags">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              formControlName="tags"
              class="form-control"
              placeholder="tag1, tag2, tag3">
          </div>

          <div class="form-group">
            <label>
              <input
                type="checkbox"
                formControlName="published">
              Publish immediately
            </label>
          </div>

          <div class="preview-section" *ngIf="previewHtml">
            <h3>Preview</h3>
            <div class="preview-content" [innerHTML]="previewHtml"></div>
          </div>

          <div class="button-group">
            <button type="button" class="btn btn-secondary" (click)="generatePreview()">
              Preview
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="!postForm.valid">
              Save Post
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .post-form-container {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .markdown-editor {
      font-family: monospace;
      resize: vertical;
    }

    .preview-section {
      margin: 2rem 0;
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      border: none;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class AdminComponent {
  postForm: FormGroup;
  previewHtml: string = '';

  constructor(
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
}
