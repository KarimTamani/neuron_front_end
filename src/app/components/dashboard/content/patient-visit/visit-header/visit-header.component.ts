import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-visit-header',
  templateUrl: './visit-header.component.html',
  styleUrls: ['./visit-header.component.css']
})
export class VisitHeaderComponent implements OnInit {
  @Output() selectPageEvent : EventEmitter<number> ; 
  public selectedPage : number = 1 ; 
  constructor() {
    this.selectPageEvent = new EventEmitter<number>();  
  }

  ngOnInit(): void {
  }
  select(page : number) { 
    this.selectedPage = page ; 
    this.selectPageEvent.emit (page) ; 
  }
}
