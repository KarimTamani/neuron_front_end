import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { NeuronResponse } from 'src/app/classes/NeuronResponse';

@Component({
  selector: 'app-diagnosis-manager',
  templateUrl: './diagnosis-manager.component.html',
  styleUrls: ['./diagnosis-manager.component.css']
})
export class DiagnosisManagerComponent implements OnInit {
  public offset : number = 0 ; 
  public limit : number = 10 ; 
  public lastSearch : any = {} ; 
  public count : number = 0 ; 
  public neuronResponses : NeuronResponse[] = [] ; 
  public modelOutputs : any[] = []  ; 

  constructor(private apollo : Apollo) {
  
    
  }
  ngOnInit(): void {
    this.apollo.query({
      query: gql`{
        getModelsOutput {type  , output}
      }`
    }).pipe(map(result => (<any>result.data).getModelsOutput)).subscribe((data) => {
      this.modelOutputs = data  ; 
      this.loadDiagnosis() ; 
    })
  }
  
  private loadDiagnosis(searchQuery = null , type = null , startDate = null , endDate = null) { 
    this.apollo.query({
      query : gql`
        query SEARCH_DIAGNOSIS($searchQuery : String , $type : String , $startDate : String , $endDate  :String , $offset : Int , $limit : Int) { 
          searchNeuronResponses(
            searchQuery : $searchQuery , 
            type : $type , 
            startDate : $startDate , 
            endDate: $endDate , 
            offset : $offset , 
            limit : $limit
          ) { 
            count
            rows {
              id
              input
              type
              
              neuronPrediction 
              neuronCollection {
                id
                name
              }
              visit {
                id
                vitalSetting  {
                  weight size 
                }
                medicalFile {
                  id
                  name
                  lastname
                  birthday
                  gender
                  phone
                }
              }
            }
          }
      }` ,  
        variables : { 
          searchQuery : searchQuery , 
          type : type , 
          startDate : startDate , 
          endDate : endDate ,  
          offset : this.offset , 
          limit : this.limit 
        }
      
    }).pipe(map(value => (<any>value.data).searchNeuronResponses)).subscribe((data) => { 
      this.count = data.count ; 
      this.neuronResponses = data.rows ; 
    }) 
  }

  
  
  search($event) {
    this.offset = 0;
    this.lastSearch = $event;
    this.loadDiagnosis(
      $event.searchQuery,
      $event.type , 
      $event.startDate,
      $event.endDate
    );
  }
  selectPage($event) {
    this.offset = $event;
    this.loadDiagnosis(
      this.lastSearch.searchQuery,
      this.lastSearch.type , 
      this.lastSearch.startDate,
      this.lastSearch.ednDate
    )
  }
}
