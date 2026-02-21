import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {CommonModule} from "@angular/common";
import {BreadcumbComponent} from "../../layaot/breadcumb/breadcumb.component";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  standalone:true,
  imports: [CommonModule, BreadcumbComponent],
})
export class ServiceComponent implements OnInit{
    constructor(private api:ApiService) {
    }
  serivice_list:any
  ngOnInit(): void {
      this.api.get_service_list().subscribe(r=>{

        // @ts-ignore
        this.serivice_list = r['data']
      })
  }
}
