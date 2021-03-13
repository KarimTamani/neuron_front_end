import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckUp } from 'src/app/classes/CheckUp';

@Component({
  selector: 'app-check-up',
  templateUrl: './check-up.component.html',
  styleUrls: ['./check-up.component.css']
})
export class CheckUpComponent implements OnInit {
  @Input() checkUp : CheckUp ; 
  public selected : boolean = false;  
  @Output() selectEvent : EventEmitter<CheckUp> ; 
  constructor() {
    this.selectEvent  = new EventEmitter<CheckUp>() ; 
  }

  ngOnInit(): void {
  }

  public select() { 
    this.selected = !this.selected ; 
    this.selectEvent.emit(this.checkUp) ; 
  }

}
