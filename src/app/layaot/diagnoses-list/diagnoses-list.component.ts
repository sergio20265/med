import {Component, Input, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import * as _ from "lodash";
import {CommonModule} from "@angular/common";
import {BreadcumbComponent} from "../breadcumb/breadcumb.component";
import {RouterModule} from "@angular/router";

// import * as Russian from "russian-nouns-js";


@Component({
  standalone: true,
  imports: [CommonModule,
    BreadcumbComponent, RouterModule,],
  selector: 'app-diagnoses-list',
  templateUrl: './diagnoses-list.component.html',
  styleUrls: ['./diagnoses-list.component.scss']
})
export class DiagnosesListComponent implements OnInit {
  diagnoses_list: any
  @Input() breadcumb: boolean = true
  @Input() gorod: any

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
// const rne = new Russian.Engine();
// console.log(rne.decline({text: 'имя', gender: 'средний'}, 'родительный'))
    this.api.get_diagnoses().subscribe(r => {
      // @ts-ignore
      this.diagnoses_list = _.chunk(r.data, 6)
      // @ts-ignore
      // r.data.forEach(r=>console.log(r.attributes.title,rne.decline({text: r.attributes.title, gender: 'средний'}, 'родительный')))
    })
  }

}
