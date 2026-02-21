import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';

@Component({
    selector: 'app-staff',
    templateUrl: './staff.component.html',
    styleUrls: ['./staff.component.scss'],
    standalone: true,
    imports: [BreadcumbComponent, NgIf, NgFor, RouterLink]
})
export class StaffComponent implements OnInit{
  constructor(private api:ApiService) {
  }
  staff_list:any
  ngOnInit(): void {
    this.api.get_personal_list().subscribe(r=>this.staff_list=r)
  }



}
