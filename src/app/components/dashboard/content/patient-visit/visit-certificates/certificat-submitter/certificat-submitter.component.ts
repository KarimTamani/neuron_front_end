import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Certificat } from 'src/app/classes/Certificat';
import { CertificatModel } from 'src/app/classes/CertificatModel';
import { Visit } from 'src/app/classes/Visit';
import { InteractionService } from 'src/app/services/interaction.service';
@Component({
  selector: 'app-certificat-submitter',
  templateUrl: './certificat-submitter.component.html',
  styleUrls: ['./certificat-submitter.component.css']
})
export class CertificatSubmitterComponent implements OnInit {

  public certificatTypes: string[] = [
    "Certificat",
    "Compte-Rendu"
  ];
  
  public selectedType: string;
  public certificatModels: CertificatModel[] = [];
  public selectedModel: CertificatModel;
  
  @Input() certificat: any;
  @Input() visit: Visit;

  constructor(private apollo: Apollo , private router : Router , private interactionService : InteractionService) {
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
    })
  }

  public openModels() { 
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page" : "certificat-models" , 
        "models" : decodeURIComponent(JSON.stringify(this.certificatModels.filter(value => value.type == this.selectedType))) , 
        "title" : "Choisie un Model de Certificat"
      }
    }) ; 

    const subscription = this.interactionService.certificatModelSelected.subscribe((data) => { 
      this.selectedModel = data ; 
      console.log(this.selectedModel) ; 
      subscription.unsubscribe() ; 
    })
  }

  public back() {
    this.selectedModel = null;
  }



}
