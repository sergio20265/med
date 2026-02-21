import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../api.service";
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
declare function vs_carousel_init():any
@Component({
    selector: 'app-doctor-carusel',
    templateUrl: './doctor-carusel.component.html',
    styleUrls: ['./doctor-carusel.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, RouterLink]
})
export class DoctorCaruselComponent implements OnInit {

  staff_list: any
@ViewChild('doctor_carusel')
  set watch(block: ElementRef) {
    if (block) {
      console.log(block)
      vs_carousel_init()
      // vs_carousel_init()
    }
  }
  constructor(private api: ApiService) {
  }

  ngOnInit(): void {

    this.api.get_personal_list().subscribe(r => {
      this.staff_list = r

    })
  }

}
