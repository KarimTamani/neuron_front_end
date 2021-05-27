import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Document } from 'src/app/classes/Document';
import { SUCCESS , Message} from 'src/app/classes/Message';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-document-submitter',
  templateUrl: './document-submitter.component.html',
  styleUrls: ['./document-submitter.component.css']
})
export class DocumentSubmitterComponent implements OnInit {
  @Output() closeEvent: EventEmitter<null>;
  public image: any = null;
  public document: Document;
  public visitId: number;
  public clearImage : Subject<null> ; 
  public form: FormGroup = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(3)
    ]),
    description: new FormControl('', [
      Validators.minLength(3)
    ])
  });

  public isEdit: boolean = false;
  public initUrl : string  ; 
  constructor(private apollo: Apollo, private route: ActivatedRoute, private interactionService: InteractionService) {
    this.closeEvent = new EventEmitter<null>();
    this.document = new Document();
    this.clearImage = new Subject<null>() ; 

  }
  ngOnInit(): void {
    this.visitId = this.route.snapshot.queryParams["visit-id"];
    if (this.route.snapshot.queryParams["document"]) {
      this.document = JSON.parse(decodeURIComponent(this.route.snapshot.queryParams["document"]));
      this.isEdit = true ; 
      this.initUrl = this.document.path ; 
    }
  };

  public onImageSelected(image) {
    this.image = image
  }

  public clear() {
    this.document = new Document();
    this.clearImage.next() ;  
  }
  public save() {
    this.apollo.mutate({
      mutation: gql`
        mutation ADD_DOCUMENT($file : Upload! , $name : String! , $description : String) { 
          addDocument(document : {
            file : $file , 
            name : $name , 
            description : $description , 
            visitId : ${this.visitId}
          }) {
            id path name description createdAt updatedAt 
          }
        }
      
        ` , variables: {
        name: this.document.name,
        description: this.document.description,
        file: this.image
      },
      context: {
        useMultipart: true
      }
    }).pipe(map(value => (<any>value.data).addDocument)).subscribe((data) => {
      this.interactionService.documentAdded.next(data);
      this.interactionService.showMessage.next(<Message> {
        message : `Document ${this.document.name} est ajouté` , 
        type : SUCCESS
      })
      this.closeEvent.emit();

    })
  }

  public edit() { 
    this.apollo.mutate({
      mutation: gql`
        mutation EDIT_DOCUMENT($file : Upload , $name : String! , $description : String) { 
          editDocument(documentId : ${this.document.id} , document : {
            file : $file , 
            name : $name , 
            description : $description , 
          })  { 
            id path name description createdAt updatedAt 
          }
        }
      
        ` , variables: {
        name: this.document.name,
        description: this.document.description,
        file: this.image
      },
      context: {
        useMultipart: true
      }
    }).pipe(map(value => (<any>value.data).editDocument)).subscribe((data) => {
      
      this.interactionService.documentEdit.next(data);
      this.interactionService.showMessage.next(<Message> {
        message : `Document ${this.document.name} est édité` , 
        type : SUCCESS
      })
      this.closeEvent.emit();
    })
    
  }
}
