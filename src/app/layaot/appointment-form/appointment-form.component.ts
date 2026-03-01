import {Component, Input} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import {ApiService} from "../../api.service";
import { NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-appointment-form',
    templateUrl: './appointment-form.component.html',
    styleUrls: ['./appointment-form.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, InputTextModule, ButtonModule, NgIf]
})
export class AppointmentFormComponent {
  @Input() form_type: string = ''
  isSubmitted: boolean = false;
  myForm: FormGroup = new FormGroup({
    "name": new FormControl('',[Validators.required,] ),
    "phone": new FormControl('',[Validators.required,] ),
  });
  constructor(private api: ApiService) {}

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
      const { name, phone } = this.myForm.value;
      this.api.sendFormNotification(name, phone, `🏥 Новая заявка (${this.form_type || 'консультация'})`);
      this.isSubmitted = true;
      this.myForm.reset();
    }
  }

  resetForm() {
    this.isSubmitted = false;
    this.myForm.reset();
  }
}
