import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Certificat } from 'src/app/classes/Certificat';
import { CheckUpType } from 'src/app/classes/CheckUpType';
import { NeuronResponse } from 'src/app/classes/NeuronResponse';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-visit-more-details',
  templateUrl: './visit-more-details.component.html',
  styleUrls: ['./visit-more-details.component.css']
})
export class VisitMoreDetailsComponent implements OnInit {
  @Input() visit : Visit ; 
  public prescriptionPage : number = 1 ; 
  public documentPage : number  = 1  ;  
  public selectedCertificat : Certificat ; 
  public checkUpTypes : CheckUpType[] = [] ; 


  public documents : Document[] = [] ; 
  public neuronResponses : NeuronResponse[] = [] ; 

  public modelOutputs : any[] = [] ; 
  constructor(private apollo : Apollo) { }

  ngOnInit(): void {

    this.apollo.query({
      query: gql`
        {  
          getCheckUpTypes { id name checkUps { id name checkUpTypeId }}
        }`
    }
    ).pipe(map(value => (<any>value.data).getCheckUpTypes)).subscribe((data) => {
      this.checkUpTypes = data;
    }) ; 



    this.apollo.query({
      query: gql`{
        getModelsOutput {type  , output}
      }`
    }).pipe(map(result => (<any>result.data).getModelsOutput)).subscribe((data) => {
    
      this.modelOutputs = data ; 
      this.apollo.query({
        query : gql`
          { 
            getVisitNeuronRequest(visitId : ${this.visit.id}) { 
              neuronCollection { id name models { id name } speciality { id name }}
              doctorPrediction
              neuronPrediction
              id
              type 
              input
              createdAt
            }
          }`
      }).pipe(map(value => (<any>value.data).getVisitNeuronRequest)).subscribe((data) => { 
        this.neuronResponses = data ; 
        for (let index = 0 ; index < this.neuronResponses.length ; index++) { 
          this.neuronResponses[index].visit = this.visit ; 
        }
        
      }) ;
    }); 
     
    this.apollo.query({
      query : gql`{ 
          getVisitDocuments(visitId : ${this.visit.id}) { 
            id 
            path 
            name 
            description 
            createdAt 
            updatedAt 
          }
        }`
    }).pipe(map(value => (<any>value.data).getVisitDocuments)).subscribe((data) => { 
      this.documents = data ; 
      if (this.documents.length > 0 && this.neuronResponses.length ==0) 
        this.documentPage = 2 
    
    })
  }

  selectCertificat(certificat) { 
    this.selectedCertificat = certificat ; 
    this.prescriptionPage = 2  ; 
  }

}
