import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../api.service";
import {Meta} from "@angular/platform-browser";
import { NgIf } from '@angular/common';
import { BreadcumbComponent } from '../../layaot/breadcumb/breadcumb.component';

@Component({
    selector: 'app-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    standalone: true,
    imports: [BreadcumbComponent, NgIf]
})
export class ArticleComponent implements OnInit{
  article: any;
  constructor(private api: ApiService,private metaTagService: Meta) {
  }
  ngOnInit(): void {
    this.api.get_article_detail('raczion').subscribe(r=>{
      // @ts-ignore
      this.article = r.data.attributes
    })
  }

}
