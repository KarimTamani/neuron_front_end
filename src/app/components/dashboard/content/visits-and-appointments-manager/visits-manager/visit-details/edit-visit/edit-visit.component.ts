import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { decode } from 'punycode';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-edit-visit',
  templateUrl: './edit-visit.component.html',
  styleUrls: ['./edit-visit.component.css']
})
export class EditVisitComponent implements OnInit {
  @Output() closeEvent : EventEmitter<null> ; 
  @Input() visit : Visit = null ; 
  constructor(private route : ActivatedRoute) {
    this.closeEvent = new EventEmitter<null>() ; 
  }

  ngOnInit(): void {
   
  }

  close($event) { 
    this.closeEvent.emit() ; 
  }

}
