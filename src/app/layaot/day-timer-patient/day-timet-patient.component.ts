import {Component, ElementRef, ViewChild} from '@angular/core';

declare function make_timer(): any;

@Component({
    selector: 'app-day-timer-patient',
    templateUrl: './day-timer-patient.component.html',
    styleUrls: ['./day-timer-patient.component.css'],
    standalone: true
})
export class DayTimerPatientComponent {
  @ViewChild('watch')
  set watch(block: ElementRef) {
    if (block) {
      make_timer()
    }
  }
}
