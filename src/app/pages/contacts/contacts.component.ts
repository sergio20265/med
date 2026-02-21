import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import {ApiService} from "../../api.service";
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';


@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styles: [],
    standalone: true,
    imports: [BreadcumbComponent, ReactiveFormsModule]
})
export class ContactsComponent {
  start: boolean = true

  myForm: FormGroup = new FormGroup({
    "name": new FormControl('', Validators.required),
    "phone": new FormControl('', Validators.required),
    "email": new FormControl('', Validators.email,),
    "message": new FormControl('', Validators.required),
  });

  constructor(private api: ApiService) {
  }

  submit() {
    if (this.myForm.valid) {
      this.api.send_telegram(505467091, `Имя:${this.myForm.value['name']}Номер телефона:${this.myForm.value['phone']}\nПочта:${this.myForm.value['email']}\nСобщение:${this.myForm.value['message']}`).subscribe()
      this.api.send_form_data(this.myForm.value).subscribe()

    }

  }

}
