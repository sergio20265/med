import {AfterContentInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

declare function popupSideMenu(): any;

declare function MagnificPopup(): any;
declare function vs_carousel_init():any

@Component({
    selector: 'app-service',
    templateUrl: './service.component.html',
    styles: [],
    standalone: true
})
export class ServiceComponent implements AfterContentInit {

  @ViewChild('vsservicewrapper')
  set watch(block: ElementRef) {
    if (block) {
      console.log(block)
      vs_carousel_init()
      // vs_carousel_init()
    }
  }
  ngAfterContentInit(): void {
    popupSideMenu()
    MagnificPopup()
    // vs_carousel_init()
  }

  // ngOnInit(): void {
  //   init_js()
  // }
}
