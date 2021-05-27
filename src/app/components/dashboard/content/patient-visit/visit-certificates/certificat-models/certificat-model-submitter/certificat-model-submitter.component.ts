import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { timeStamp } from 'console';
import gql from 'graphql-tag';
import { Editor } from 'ngx-editor';
import { map } from 'rxjs/operators';
import { CertificatModel } from 'src/app/classes/CertificatModel';
import { SUCCESS } from 'src/app/classes/Message';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-certificat-model-submitter',
  templateUrl: './certificat-model-submitter.component.html',
  styleUrls: ['./certificat-model-submitter.component.css']
})
export class CertificatModelSubmitterComponent implements OnInit {
  public certificatModel: CertificatModel;
  public editor: Editor;
  private insertedPosition: any = null;
  @Input() editMode : boolean = false ; 
  @Input() initModel: CertificatModel;
  @Output() backEvent: EventEmitter<null>;
  @Output() saveEvent: EventEmitter<CertificatModel>;
  @Output() editEvent : EventEmitter<CertificatModel> ; 

  public form: FormGroup = new FormGroup({
    title: new FormControl("", [
      Validators.required,
      Validators.minLength(3)
    ])
  })

  public toolbar = [
    ["bold", "italic", "underline"]
  ]
  constructor(private apollo: Apollo , private interactionService : InteractionService) {
    this.editor = new Editor();
    this.backEvent = new EventEmitter<null>();
    this.saveEvent = new EventEmitter<CertificatModel>();
    this.editEvent = new EventEmitter<CertificatModel>() ; 

  }

  ngOnInit(): void {
    this.certificatModel = new CertificatModel();
    
    this.certificatModel.html = this.initModel.html;
    this.certificatModel.id = this.initModel.id;
    this.certificatModel.type = this.initModel.type; 
    if (this.editMode) { 
      this.certificatModel.title = this.initModel.title ; 
    }

    
    this.editor.view.dom.addEventListener("click", (event) => {
      this.insertedPosition = this.editor.view.state.selection.$anchor;

    })

    this.editor.view.dom.addEventListener("keyup", (event) => {
      this.insertedPosition = this.editor.view.state.selection.$anchor;
    })

  }


  public save() {
    if (this.certificatModel.html.trim().length == 0)
      return;
    this.apollo.mutate({
      mutation: gql`
        mutation { 
          addCertificatModel(certificatModel : { 
            title : "${this.certificatModel.title}" ,
            html : "${this.certificatModel.html}" 
            type : "${this.certificatModel.type}"
          }) { 
            id 
            title 
            html 
            type 
            createdAt 
            updatedAt 
          }
        }`
    }).pipe(
      map(value => (<any>value.data).addCertificatModel)
    ).subscribe((data) => {
      
      this.interactionService.showMessage.next({
        message : "Modèle de certificat est ajouté"  , 
        type : SUCCESS 
      })
      this.saveEvent.emit(data);
    
    
    
    })
  }

  public back() {
    this.backEvent.emit();
  }

  public addEmpty() {
    var html = this.certificatModel.html.split("<p>").filter(value => value.length > 0);

    var parentOffset = 0;
    var insertedNode = html.length - 1;

    if (this.insertedPosition) {
      parentOffset = this.insertedPosition.parentOffset;
      insertedNode = this.insertedPosition.path[1];
    }
    var node = html[insertedNode];
    var position = 0; var tagsLength = 0; var insideTag = false;

    for (let index = 0; index < node.length; index++) {
      if (position == parentOffset)  
        break ; 
      
      if (node[index] == "<") {
        insideTag = true;
        tagsLength += 1;
        continue;
      }
      if (node[index] == ">") {
        insideTag = false;
        tagsLength += 1;
        continue;
      }
      if (insideTag == false) { 
        position +=1 ; 
      }
      else { 
        tagsLength +=1 ; 
      }   
    } 

    position += tagsLength  ; 
    html[insertedNode] = node.slice(0, position) + "<strong>__________________</strong>" + node.slice(position);
    this.certificatModel.html = "<p>" + html.join("<p>");
  }

  public edit() { 
    this.apollo.mutate({
      mutation : gql`
        mutation {
          editCertificatModel(certificatModelId : ${this.certificatModel.id} ,certificatModel : { 
            title : "${this.certificatModel.title}" ,
            html : "${this.certificatModel.html}" 
            type : "${this.certificatModel.type}"
          })
        }`
    }).pipe(map(value => (<any>value.data).editCertificatModel)).subscribe((data) => { 
      this.interactionService.showMessage.next({
        message : "Modèle de certificat est édité"  , 
        type : SUCCESS 
      })
      this.editEvent.emit(this.certificatModel) ; 
    })
  }
}
