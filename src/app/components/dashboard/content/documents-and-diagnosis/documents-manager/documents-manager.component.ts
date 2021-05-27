import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document } from 'src/app/classes/Document';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-documents-manager',
  templateUrl: './documents-manager.component.html',
  styleUrls: ['./documents-manager.component.css']
})
export class DocumentsManagerComponent implements OnInit, OnDestroy{
  public offset: number = 0;
  public limit: number = 30;
  public lastSearch: any = {};
  public count: number = 0;
  public documents: Document[] = [];
  public subscriptions : Subscription[] = [] ; 
  constructor(
    private apollo: Apollo,
    private router: Router,
    private interactionService: InteractionService
  ) { }

  ngOnInit(): void {
    this.loadDocuments(null, null, null);
  }


  private loadDocuments(searchQuery = null, startDate = null, endDate = null) {
    this.apollo.query({
      query: gql`
        query SEARCH_DOCUMNETS($searchQuery : String, $startDate : String , $endDate : String , $offset : Int , $limit : Int) { 
          searchDocuments(
            searchQuery : $searchQuery , 
            startDate : $startDate , 
            endDate : $endDate , 
            offset : $offset , 
            limit : $limit 
          ) { 
            rows {
              id 
              path
              createdAt
              updatedAt
              description
              name
              visit {
                medicalFile { id name gender lastname birthday phone email}
              }
            }
            count        
          }
        }`
      , variables: {
        searchQuery: searchQuery,
        startDate: startDate,
        endDate: endDate,
        offset: this.offset,
        limit: this.limit
      }
    }).pipe(map(value => (<any>value.data).searchDocuments)).subscribe((data) => {
      this.documents = data.rows; 
      this.count = data.count;
    }); 

    this.subscriptions.push(this.interactionService.documentDeleted.subscribe((data) => { 
      var index = this.documents.findIndex(value => value.id == data.id) ; 
      if (index >= 0) 
        this.documents.splice(index , 1 ) ; 
    }) ) ; 

    this.subscriptions.push( this.interactionService.documentEdit.subscribe((data) => { 
      var index = this.documents.findIndex(value => value.id == data.id) ; 
      if (index >= 0) { 
        this.documents[index].name = data.name ; 
        this.documents[index].description = data.description ;
        this.documents[index].path = data.path ;  

      }
    })) ;   }


  search($event) {
    this.offset = 0;
    this.lastSearch = $event;
    this.loadDocuments(
      $event.searchQuery,
      $event.startDate,
      $event.endDate
    );
  }
  selectPage($event) {
    this.offset = $event;
    this.loadDocuments(
      this.lastSearch.searchQuery,
      this.lastSearch.startDate,
      this.lastSearch.ednDate
    )
  }


  public selectDocument(document) {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "document-details",
        "title": "Détails du document",
        "document": encodeURIComponent(JSON.stringify(document))
      }
    }) ; 
  }

  public ngOnDestroy() { 
    this.subscriptions.forEach(subs => subs.unsubscribe()) ; 
  }

}
