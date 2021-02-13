import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  @Output() pageSelected: EventEmitter<any>;
  constructor() {
    this.pageSelected = new EventEmitter<any>();
  }

  ngOnInit(): void {

  }

  public getPages() {
    var pages = [];
    for (let index = 0; index < this.pagesNum(); index++) {
      pages.push(index + 1);
    }
    return pages;
  }
  public pagesNum() {
    return Math.ceil(this.count / this.limit);
  }
  public currentPage() {
    return (this.offset / this.limit) + 1;
  }

  public next() {
    if (this.pagesNum() == this.currentPage())
      return;
    this.offset += this.limit;
    this.pageSelected.emit(this.offset);
  }
  public previous() {
    if (this.currentPage() == 1)
      return;
    this.offset -= this.limit;
    this.pageSelected.emit(this.offset);

  }

  public select(page) {
    this.offset = (this.limit * (page - 1))
    this.pageSelected.emit(this.offset);

  }
}
