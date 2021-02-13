import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() count: number;
  @Input() offset: number;
  @Input() limit: number;
  @Input() loaded: number;
  constructor() { }

  ngOnInit(): void {
  }

  public getPages() {
    var pages = [] ; 
    for(let index  = 0 ; index < this.count ; index ++) { 
      pages.push(index + 1)  ;
    }
    return pages ; 
  }
  public pagesNum() {
    return Math.ceil(this.count / this.limit);
  }
  public currentPage() {
    return (this.offset / this.limit) + 1;
  }

}
