import {Component, Input} from '@angular/core';
import {ApiService} from "../../api.service";
import {CommonModule} from "@angular/common";
import {BreadcumbComponent} from "../breadcumb/breadcumb.component";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-rehabilitation',
  templateUrl: './rehabilitation.component.html',
  styleUrls: ['./rehabilitation.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule,
    BreadcumbComponent,],
})
export class RehabilitationComponent {
  rehabilitationlist: any
  @Input() breadcumb: boolean = true
  @Input() gorod: any
  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
// const rne = new Russian.Engine();
// console.log(rne.decline({text: 'имя', gender: 'средний'}, 'родительный'))
    this.api.get_rehabilitationlist().subscribe(r => {
      // @ts-ignore
      this.rehabilitationlist = _.chunk(r.data, 5)
      // @ts-ignore
      // r.data.forEach(r=>console.log(r.attributes.title,rne.decline({text: r.attributes.title, gender: 'средний'}, 'родительный')))
    })
  }
}
