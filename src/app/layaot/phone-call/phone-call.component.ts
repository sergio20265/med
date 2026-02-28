import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from "@angular/forms";
import {ApiService} from "../../api.service";
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-phone-call',
    templateUrl: './phone-call.component.html',
    styleUrls: ['./phone-call.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, InputMaskModule, ButtonModule]
})
export class PhoneCallComponent {
  constructor(private api: ApiService) {
  }

  // Кастомный валидатор для российского номера телефона
  phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    const value = control.value;
    
    if (!value) {
      return null; // Пустое значение обрабатывается required валидатором
    }
    
    if (!phoneRegex.test(value)) {
      return { invalidPhone: true };
    }
    
    return null;
  }

  myForm: FormGroup = new FormGroup({
    "name": new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ]),
    "phone": new FormControl('', [
      Validators.required,
      this.phoneValidator.bind(this)
    ])
  });

  submit() {
    if (this.myForm.valid) {
      // Очищаем номер телефона от маски для отправки
      const formData = {
        ...this.myForm.value,
        phone: this.myForm.value.phone.replace(/[^\d]/g, '') // Оставляем только цифры
      };
      
      this.api.send_form_data(formData).subscribe({
        next: (response) => {
          console.log('Форма успешно отправлена:', response);
          this.api.sendFormNotification(this.myForm.value.name, this.myForm.value.phone, '📞 Заявка на обратный звонок');
          this.myForm.reset();
        },
        error: (error) => {
          console.error('Ошибка при отправке формы:', error);
          // Можно добавить уведомление об ошибке
        }
      });
    } else {
      // Отмечаем все поля как touched для показа ошибок валидации
      Object.keys(this.myForm.controls).forEach(key => {
        this.myForm.get(key)?.markAsTouched();
      });
    }
  }

  // Геттеры для удобного доступа к ошибкам валидации
  get nameErrors() {
    const nameControl = this.myForm.get('name');
    if (nameControl?.errors && nameControl.touched) {
      if (nameControl.errors['required']) return 'Имя обязательно для заполнения';
      if (nameControl.errors['minlength']) return 'Имя должно содержать минимум 2 символа';
      if (nameControl.errors['maxlength']) return 'Имя не должно превышать 50 символов';
    }
    return null;
  }

  get phoneErrors() {
    const phoneControl = this.myForm.get('phone');
    if (phoneControl?.errors && phoneControl.touched) {
      if (phoneControl.errors['required']) return 'Номер телефона обязателен для заполнения';
      if (phoneControl.errors['invalidPhone']) return 'Введите корректный номер телефона';
    }
    return null;
  }
}

