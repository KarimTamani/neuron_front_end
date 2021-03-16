import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Document } from 'src/app/classes/Document';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-documents',
  templateUrl: './visit-documents.component.html',
  styleUrls: ['./visit-documents.component.css']
})
export class VisitDocumentsComponent implements OnInit {
  public documents: Document[] = [];
  public visitsDocuments: Visit[] = []
  @Input() visit: Visit;
  public expandVisit: number;
  constructor(private apollo: Apollo, private dataService: DataService , private router : Router, private interactionService : InteractionService) { }

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
      })
      this.documents = data;

      this.visitsDocuments.push(<Visit>{
        id: this.visit.id,
        documents: [],
        createdAt: this.visit.createdAt = this.dataService.castFRDate(new Date(parseInt(this.visit.createdAt)))
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
  }

  public selectVisit(visitDocument, i) {
    if (i == 0)
      return;

    if (visitDocument.id == this.expandVisit)
      this.expandVisit = null;
    else 
      this.expandVisit = visitDocument.id ; 
  }
  public openSubmitter() { 
    
    
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page" : "document-submitter" , 
        "title" : "Ajouter un document" , 
        "visit-id" : this.visit.id 
      }
    }); 

    const subscription = this.interactionService.documentAdded.subscribe((data) => { 
      this.visitsDocuments[0].documents.splice(0 , 0 , data) ; 
      subscription.unsubscribe() ; 
    })
  }
}
