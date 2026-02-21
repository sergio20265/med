import {AfterContentInit, Component} from '@angular/core';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
declare const serviceSlider1init:any
@Component({
    selector: 'app-registration-rules',
    templateUrl: './registration-rules.component.html',
    styles: [],
    standalone: true,
    imports: [AppointmentFormComponent]
})
export class RegistrationRulesComponent implements AfterContentInit {
  ngAfterContentInit(): void {
    serviceSlider1init()
  }

}
