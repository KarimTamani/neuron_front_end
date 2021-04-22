import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Document } from 'src/app/classes/Document';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {
  @Input() document: Document;
  @Input() controllable : boolean = true ; 
  @Output() editEvent: EventEmitter<Document>;
  @Output() deleteEvent: EventEmitter<number>;
  @Input() patientInfo : boolean = false ; 
  @Output() clickEvent : EventEmitter<Document> ; 

  constructor(private router: Router, private interactionService: InteractionService , private apollo : Apollo ) {
    this.editEvent = new EventEmitter<Document>();
    this.deleteEvent = new EventEmitter<number>();
    this.clickEvent = new EventEmitter<Document>() ; 
    
  }

  ngOnInit(): void { 

  }


  

  
}
