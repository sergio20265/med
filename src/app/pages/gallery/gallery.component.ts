import {Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, CommonModule} from '@angular/common';
import {ApiService} from "../../api.service";
import {SharedModule} from 'primeng/api';
import {GalleriaModule} from 'primeng/galleria';
import {CarouselModule} from "ngx-owl-carousel-o";

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [CommonModule, GalleriaModule, SharedModule, CarouselModule]
})
export class GalleryComponent implements OnInit {
  images: any;
  isBrowser: boolean;

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];


  constructor(private api: ApiService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.api.get_photos().subscribe(r => {
        // console.log(r)
        // @ts-ignore
        this.images = r['files'].reverse()
        console.log(this.images)
      })
    }
    // this.photoService.getImages().then((images) => (this.images = images));
  }
}
