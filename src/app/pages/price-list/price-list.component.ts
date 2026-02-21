import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {Meta} from "@angular/platform-browser";
import { NgIf } from '@angular/common';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';

@Component({
    selector: 'app-price-list',
    templateUrl: './price-list.component.html',
    styles: [],
    standalone: true,
    imports: [BreadcumbComponent, NgIf]
})
export class PriceListComponent implements OnInit {

  price_page: any

  constructor(private api: ApiService,private metaTagService: Meta) {
    // this.metaTagService.addTags([
    //   {
    //     name: 'title',
    //     content: 'Angular SEO Integration, Music CRUD, Angular Universal',
    //   },
    //   {
    //     name: 'keywords',
    //     content: 'Angular SEO Integration, Music CRUD, Angular Universal',
    //   },
    //   { name: 'robots', content: 'index, follow' },
    //   { name: 'author', content: 'Digamber Singh' },
    //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    //   { name: 'date', content: '2019-10-31', scheme: 'YYYY-MM-DD' },
    //   { charset: 'UTF-8' },
    // ]);
  }

  ngOnInit(): void {
    this.api.get_price_page().subscribe(r => {
      // @ts-ignore
      this.price_page = r.data.attributes
    })

    // console.log(this.metaTagService.getTag('title'))

  }
}
