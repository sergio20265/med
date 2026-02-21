import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MainPromoOneComponent } from '../main-promo-one/main-promo-one.component';
import { PhoneCallComponent } from '../phone-call/phone-call.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
declare function HeroSliderActive(): any;
declare function vs_carousel_init(): any;
@Component({
    selector: 'app-main-slider',
    templateUrl: './main-slider.component.html',
    styleUrls: ['./main-slider.component.scss'],
    standalone: true,
    imports: [OverlayPanelModule, PhoneCallComponent, MainPromoOneComponent]
})
export class MainSliderComponent implements OnInit{
  visible: any;
  @ViewChild('slider')
  set watch(slider: ElementRef) {
    if (slider) {
      HeroSliderActive()
      // vs_carousel_init()
    }
  }
  ngOnInit(): void {

  }

}
