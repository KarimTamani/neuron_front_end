import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Document } from 'src/app/classes/Document';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.css']
})
export class DocumentDetailsComponent implements OnInit {
  public document: Document;
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private apollo : Apollo, 
    private interactionService : InteractionService) { }

  ngOnInit(): void {

    var params = this.route.snapshot.queryParams;
    if (params["document"]) {
      this.document = JSON.parse(decodeURIComponent(params["document"]));
    }

  }

  public delete() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "yes-no-message",
        "title": "Suppression de document",
        "message": "vous voulez supprimer le document " + this.document.name + " ? "
      }
    });

    const subscription = this.interactionService.yesOrNo.subscribe((response) => {
      if (response) {
        this.apollo.mutate({
          mutation: gql`
              mutation { 
                removeDocument(documentId : ${this.document.id})
              }`
        }).pipe(map(value => (<any>value.data).removeDocument)).subscribe((id) => {
          this.interactionService.documentDeleted.next(this.document) ; 
        })
      }
      subscription.unsubscribe();
    })
    
  }

  public edit() {
    
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "document-submitter",
        "title": "Modifier le document " + this.document.name,
        "document": encodeURIComponent(JSON.stringify(this.document)) , 
      }
    });
    
  }

}
