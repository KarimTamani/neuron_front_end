import { EventEmitter, Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';

import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CertificatModel } from 'src/app/classes/CertificatModel';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-certificats-models',
  templateUrl: './certificats-models.component.html',
  styleUrls: ['./certificats-models.component.css']
})
export class CertificatsModelsComponent implements OnInit, OnDestroy {
  public certificatModels: CertificatModel[] = [];
  public openModelSubmitter: boolean = false;
  public submittedModel: CertificatModel;
  public editMode: boolean = false;
  public certificatTypes: string[] = [
    "Certificat",
    "Compte-Rendu"
  ];
  public subscriptions: Subscription[] = [];
  public selectedType: string;
  @Output() typeChanged: EventEmitter<string>;
  @Output() certificatSelected : EventEmitter<CertificatModel> ;  

  constructor(private apollo: Apollo, private router: Router, private interactionService: InteractionService) {
    this.selectedType = this.certificatTypes[0];
    this.typeChanged = new EventEmitter<string>() ; 
    this.certificatSelected = new EventEmitter<CertificatModel>() ;  
  }


  ngOnInit(): void {
    this.apollo.query({
      query: gql`
          query {
            getCertificatModels {
              id title type html createdAt updatedAt type isPublic 
            }
          }`
    }).pipe(map(value => (<any>value.data).getCertificatModels)).subscribe((data) => {
      this.certificatModels = data;
      if (this.certificatModels.length >= 2)
        this.submittedModel = this.certificatModels[1];
    });
  }

  get certificatTypeBased() {
    if (this.selectedType == this.certificatTypes[0])
      this.submittedModel = this.certificatModels[1];
    return this.certificatModels.filter(value => value.type == this.selectedType);
  }

  public back() {
    this.openModelSubmitter = false;
    this.editMode = false;
  }

  public save($event) {
    this.certificatModels.push($event);
    this.openModelSubmitter = false;
  }

  public editModel($event) {
    this.editMode = true;
    this.submittedModel = $event;
    this.openModelSubmitter = true;
  }

  public delete($event) {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "yes-no-message",
        "title": "Suppression du modèle de certificat",
        "message": "vous souhaitez supprimer le modèle de certificat " + $event.title
      }
    });

    const subs = this.interactionService.yesOrNo.subscribe(response => {
      if (response) {
        this.apollo.mutate({
          mutation: gql`
            mutation {
              removeCertificatModel(certificatModelId : ${$event.id})
            }`
        }).pipe(map(value => (<any>value.data).removeCertificatModel)).subscribe((data) => {
          var index = this.certificatModels.findIndex(value => value.id == $event.id)
          if (index >= 0) {
            this.certificatModels.splice(index, 1);
          }
        })
      }
      subs.unsubscribe();
    });
    this.subscriptions.push(subs);
  }

  public edit($event) {
    this.submittedModel.title = $event.title;
    this.submittedModel.html = $event.html;
    if (this.selectedType == this.certificatTypes[0])
      this.submittedModel = this.certificatModels[1];
    else
      this.submittedModel = this.certificatModels[0];

    this.editMode = false;
    this.openModelSubmitter = false;
  }
  
  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  public onChange() { 
    this.typeChanged.emit(this.selectedType) ; 
  }


  public select(model) { 
    this.certificatSelected.emit(model) ; 
  }
}
