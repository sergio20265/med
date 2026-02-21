import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { RouterLink } from '@angular/router';
declare function vs_carousel_init(): any;
@Component({
    selector: 'app-main-promo-one',
    templateUrl: './main-promo-one.component.html',
    styleUrls: ['./main-promo-one.component.scss'],
    standalone: true,
    imports: [RouterLink]
})
export class MainPromoOneComponent implements OnInit{
  ngOnInit(): void {
  }
  @ViewChild('block')
  set watch(block: ElementRef) {
    if (block) {
      // console.log(block)
      // try {
      //    vs_carousel_init()
      // }catch (s){}


      // vs_carousel_init()
    }
  }

}
