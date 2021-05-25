import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message, SUCCESS } from 'src/app/classes/Message';

@Component({
  selector: 'app-success-and-fail-messages',
  templateUrl: './success-and-fail-messages.component.html',
  styleUrls: ['./success-and-fail-messages.component.css']
})
export class SuccessAndFailMessagesComponent implements OnInit {
  @Input() message : Message ; 

  @Output() closeEvent : EventEmitter<null> ; 
  constructor() {
    this.closeEvent = new EventEmitter<null>() ; 


  }

  ngOnInit(): void {
    setTimeout(() => { 
      this.closeEvent.emit() ; 
    } , 5000 ) ; 
    
  }

}
