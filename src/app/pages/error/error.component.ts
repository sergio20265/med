import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-container">
      <div class="error-content">
        <h1>{{ errorData?.type || 404 }}</h1>
        <h2>{{ errorData?.title || 'Страница не найдена' }}</h2>
        <p>{{ errorData?.desc || 'Извините, запрашиваемая страница не существует.' }}</p>
        <a href="/" class="btn-home">Вернуться на главную</a>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 20px;
    }
    .error-content {
      text-align: center;
      max-width: 500px;
    }
    .error-content h1 {
      font-size: 4rem;
      color: #e74c3c;
      margin-bottom: 1rem;
    }
    .error-content h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #333;
    }
    .error-content p {
      margin-bottom: 2rem;
      color: #666;
    }
    .btn-home {
      display: inline-block;
      padding: 10px 20px;
      background-color: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      transition: background-color 0.3s;
    }
    .btn-home:hover {
      background-color: #2980b9;
    }
  `]
})
export class ErrorComponent {
  errorData: any;

  constructor(private route: ActivatedRoute) {
    this.errorData = this.route.snapshot.data;
  }
}