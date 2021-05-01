import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document } from 'src/app/classes/Document';
import { Message, SUCCESS } from 'src/app/classes/Message';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-documents',
  templateUrl: './visit-documents.component.html',
  styleUrls: ['./visit-documents.component.css']
})
export class VisitDocumentsComponent implements OnInit, OnDestroy {
  public documents: Document[] = [];
  public visitsDocuments: Visit[] = []
  @Input() visit: Visit;
  public expandVisit: number;
  public subscriptions: Subscription[] = [];
  constructor(private apollo: Apollo, private dataService: DataService, private router: Router, private interactionService: InteractionService) { }

  ngOnInit(): void {
    this.apollo.query({
      query: gql`
        { 
          getDocuments(medicalFileId : ${this.visit.medicalFile.id}) { 
            id name path description createdAt updatedAt visit {
              id createdAt  
            }
          }
        }`
    }).pipe(map(value => (<any>value.data).getDocuments)).subscribe((data) => {

      data.forEach(document => {
        document.visit.createdAt = this.dataService.castFRDate(new Date(parseInt(document.visit.createdAt)));
        document.visit.medicalFile = this.visit.medicalFile;
      })
      this.documents = data;

      this.visitsDocuments.push(<Visit>{
        id: this.visit.id,
        documents: [],
        createdAt: this.dataService.castFRDate(new Date(parseInt(this.visit.createdAt)))
      });

      // pipe documents into visitDocuments 
      for (let index = 0; index < this.documents.length; index++) {
        var document = this.documents[index];
        let visit = this.visitsDocuments.find(value => value.id == document.visit.id);
        if (visit) {
          visit.documents.push(document);
          continue;
        } else {
          visit = new Visit();
          visit.id = document.visit.id;
          visit.createdAt = document.visit.createdAt;
          visit.documents.push(document);
          this.visitsDocuments.push(visit);
        }
      }
    })

    this.subscriptions.push(this.interactionService.documentDeleted.subscribe((event) => {
       
      this.delete(event);
      this.interactionService.showMessage.next(<Message>{
        message: `le document ${event.name} est supprimé`,
        type: SUCCESS
      })
    }));
    
    this.subscriptions.push(this.interactionService.documentEdit.subscribe((event) => {
      console.log(event); 
      this.editDocument(event);
    }));
    
    
    this.subscriptions.push(this.interactionService.documentAdded.subscribe((data) => {
      (<any>data).visit = {
        id: this.visit.id,
        documents: [],
        createdAt: this.dataService.castFRDate(new Date(parseInt(this.visit.createdAt)))
      }; 
      (<any>data).visit.medicalFile = this.visit.medicalFile; 
      this.visitsDocuments[0].documents.splice(0, 0, data);
      this.documents.splice(0, 0, data)
    })) ; 

  }

  public selectVisit(visitDocument, i) {
    if (i == 0)
      return;

    if (visitDocument.id == this.expandVisit)
      this.expandVisit = null;
    else
      this.expandVisit = visitDocument.id;
  }


  public openSubmitter() {

    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "document-submitter",
        "title": "Ajouter un document",
        "visit-id": this.visit.id
      }
    });

  }
  public editDocument($event) {

    const index = this.documents.findIndex(value => value.id == $event.id);
    console.log(this.documents[index]) ; 
    this.documents[index].path = $event.path;
    this.documents[index].description = $event.description;
    this.documents[index].name = $event.name;

  }

  public delete($event) {
    let index = this.documents.findIndex(document => document.id == $event)
    this.documents.splice(index, 1);

    for (index = 0; index < this.visitsDocuments.length; index++) {
      let visit = this.visitsDocuments[index];
      let i = visit.documents.findIndex(value => value.id == $event.id);
      if (i >= 0) {
        visit.documents.splice(i, 1);
        break;
      }
    }
  }


  public selectDocument(document) {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "document-details",
        "title": "Details du document",
        "document": encodeURIComponent(JSON.stringify(document))
      }
    });
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }
}
