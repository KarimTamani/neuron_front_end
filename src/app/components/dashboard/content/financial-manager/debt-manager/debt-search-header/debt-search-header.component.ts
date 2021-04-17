import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-debt-search-header',
  templateUrl: './debt-search-header.component.html',
  styleUrls: ['./debt-search-header.component.css']
})
export class DebtSearchHeaderComponent implements OnInit {
  @Input() searchQuery: any = {}
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
