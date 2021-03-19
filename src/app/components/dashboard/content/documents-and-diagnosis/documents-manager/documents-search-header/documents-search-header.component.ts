import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-documents-search-header',
  templateUrl: './documents-search-header.component.html',
  styleUrls: ['./documents-search-header.component.css']
})
export class DocumentsSearchHeaderComponent implements OnInit {
  public searchQuery: any = {}
  @Output() searchEvent: EventEmitter<any>;
  constructor() {
    this.searchEvent = new EventEmitter<any>();
  
  }

  ngOnInit(): void {
  }

  public clear() {
    this.searchQuery = {};
  }

  public search() {
    this.searchEvent.emit(this.searchQuery) ;  
  }
}
