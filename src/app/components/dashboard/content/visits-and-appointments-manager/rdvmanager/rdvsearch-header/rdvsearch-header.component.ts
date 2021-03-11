import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rdvsearch-header',
  templateUrl: './rdvsearch-header.component.html',
  styleUrls: ['./rdvsearch-header.component.css']
})
export class RDVSearchHeaderComponent implements OnInit {
  @Input() startDate : string ; 
  @Output() searchEvent : EventEmitter<any> ; 
  public searchQuery : any = {} ; 
  constructor() {
    this.searchEvent = new EventEmitter<null>() ;  
  }

  ngOnInit(): void {}

  public clear() { 
    this.searchQuery = {} 
    this.startDate = null ; 

  }

  public search() { 
    this.searchQuery.startDate = this.startDate ; 
    this.searchEvent.emit(this.searchQuery)
  }
}
