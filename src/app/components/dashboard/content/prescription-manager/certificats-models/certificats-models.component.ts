import { Component, OnInit } from '@angular/core';
import { throwServerError } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { CertificatModel } from 'src/app/classes/CertificatModel';

@Component({
  selector: 'app-certificats-models',
  templateUrl: './certificats-models.component.html',
  styleUrls: ['./certificats-models.component.css']
})
export class CertificatsModelsComponent implements OnInit {
  public certificatModels: CertificatModel[] = [];
  public openModelSubmitter: boolean = false;
  public submittedModel: CertificatModel;
  public editMode: boolean = false;
  public certificatTypes: string[] = [
    "Certificat",
    "Compte-Rendu"
  ];

  public selectedType: string;
  constructor(private apollo: Apollo) {
    this.selectedType = this.certificatTypes[0];
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
    this.editMode = false ; 
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
  
    
  }

  public edit($event) { 
    this.submittedModel.title = $event.title;
    this.submittedModel.html = $event.html;
    if (this.selectedType == this.certificatTypes[0])
      this.submittedModel = this.certificatModels[1];
    else
      this.submittedModel = this.certificatModels[0]; 
    
    this.editMode = false ; 
    this.openModelSubmitter = false; 


  }
}
