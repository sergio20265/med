import {Component, Input, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import {ApiService} from "../../api.service";
import {HttpClient} from "@angular/common/http";
import { NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-appointment-form',
    templateUrl: './appointment-form.component.html',
    styleUrls: ['./appointment-form.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule, NgIf]
})
export class AppointmentFormComponent implements OnInit {
  @Input() form_type: string = ''
  isSubmitted: boolean = false;
  isLoading: boolean = false;
  myForm: FormGroup = new FormGroup({
    "name": new FormControl('',[Validators.required,] ),
    "phone": new FormControl('',[Validators.required,] ),

  });
  constructor(private api:ApiService,private http:HttpClient) {
  }
  ngOnInit(): void {

  }

  formatPhoneNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value.startsWith('8')) {
        value = '7' + value.substring(1);
      }
      if (!value.startsWith('7')) {
        value = '7' + value;
      }
    }
    
    let formattedValue = '';
    if (value.length > 0) {
      formattedValue = '+7';
      if (value.length > 1) {
        formattedValue += ' (' + value.substring(1, 4);
        if (value.length > 4) {
          formattedValue += ') ' + value.substring(4, 7);
          if (value.length > 7) {
            formattedValue += '-' + value.substring(7, 9);
            if (value.length > 9) {
              formattedValue += '-' + value.substring(9, 11);
            }
          }
        }
      }
    }
    
    event.target.value = formattedValue;
    this.myForm.get('phone')?.setValue(formattedValue);
  }

  submit() {
    if (this.myForm.valid) {
      this.isLoading = true;
      
      const formData = {
        name: this.myForm.value.name,
        phone: this.myForm.value.phone,
        form_type: this.form_type || 'consultation'
      };
      
      this.api.send_form_data(formData).subscribe({
        next: (response: any) => {
          console.log('Форма отправлена успешно', response);
          
          // Отправляем уведомления в Telegram во все настроенные чаты
          if (environment.telegramBotToken && environment.telegramChatIds && 
              environment.telegramBotToken !== 'YOUR_BOT_TOKEN_HERE' && 
              environment.telegramChatIds.length > 0) {
            
            const telegramMessage = `🏥 Новая заявка на консультацию\n\n👤 Имя: ${this.myForm.value.name}\n📞 Телефон: ${this.myForm.value.phone}\n\n📅 Время подачи: ${new Date().toLocaleString('ru-RU')}`;
            
            // Отправляем сообщение во все чаты из массива
            environment.telegramChatIds.forEach((chatId: string, index: number) => {
              if (chatId && chatId !== 'YOUR_CHAT_ID_HERE') {
                this.api.send_telegram(parseInt(chatId), telegramMessage).subscribe({
                  next: (telegramResponse) => {
                    console.log(`Уведомление в Telegram отправлено успешно в чат ${chatId}`);
                  },
                  error: (telegramError) => {
                    console.error(`Ошибка отправки уведомления в Telegram для чата ${chatId}:`, telegramError);
                  }
                });
              }
            });
          }
          
          this.isLoading = false;
          this.isSubmitted = true;
          this.myForm.reset();
        },
        error: (error: any) => {
          console.error('Ошибка отправки формы', error);
          this.isLoading = false;
        }
      });
    }
  }

  resetForm() {
    this.isSubmitted = false;
    this.myForm.reset();
  }
}
