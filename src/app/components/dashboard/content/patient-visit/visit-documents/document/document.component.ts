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

  @Output() editEvent: EventEmitter<Document>;
  @Output() deleteEvent: EventEmitter<number>;
  @Input() patientInfo : boolean = false ; 

  constructor(private router: Router, private interactionService: InteractionService , private apollo : Apollo ) {
    this.editEvent = new EventEmitter<Document>();
    this.deleteEvent = new EventEmitter<number>();
  }

  ngOnInit(): void { 

  }


  public edit() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "document-submitter",
        "title": "Modifer le document " + this.document.name,
        "document": encodeURIComponent(JSON.stringify(this.document))
      }
    });
    const subscription = this.interactionService.documentEdit.subscribe((data) => {
      this.document = data;
      subscription.unsubscribe();
      this.editEvent.emit(this.document);
    })
  }

  public delete() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "yes-no-message",
        "title": "Subpresion d'un document",
        "message": "Voulais vous vraiments suprimer le document " + this.document.name + " ? "
      }
    });

    const subscription = this.interactionService.yesOrNo.subscribe((response) => {
      if (response) {
        this.apollo.mutate({
          mutation : gql`
            mutation { 
              removeDocument(documentId : ${this.document.id})
            }`
        }).pipe(map(value => (<any>value.data).removeDocument)).subscribe((id) => { 
          this.deleteEvent.emit (id) ; 
        })
      }
      subscription.unsubscribe();
    })
  }
}
