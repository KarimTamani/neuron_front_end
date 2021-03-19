import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { NeuronResponse } from 'src/app/classes/NeuronResponse';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-visit-diagnosis',
  templateUrl: './visit-diagnosis.component.html',
  styleUrls: ['./visit-diagnosis.component.css']
})
export class VisitDiagnosisComponent implements OnInit {
  @Input() visit: Visit;
  public neuronResponses: NeuronResponse[] = [];
  public visitsNeuronResponses: Visit[] = [];
  public expandVisit: Visit = null;
  public modelOutputs :any[] = []  ;

  constructor(private apollo: Apollo, private dataService: DataService) { }

  ngOnInit(): void {
    this.apollo.query({
      query: gql`{
        getModelsOutput {type  , output}
      }`
    }).pipe(map(result => (<any>result.data).getModelsOutput)).subscribe((data) => {
      this.modelOutputs = data ; 
      this.apollo.query({
        query: gql`
        {
          getNeuronResponses(medicalFileId: ${this.visit.medicalFile.id}) {
            id
            neuronPrediction
            doctorPrediction
            type
            input 
            visit { 
              id 
              createdAt 
                medicalFile {
                  id name lastname birthday gender
                }
                vitalSetting {
                  weight  
                  size   
                }
              
            }
            createdAt
            updatedAt
            neuronCollection {
              id
              speciality { id name }
              name
              models {
                id
                name
              }
            }
          }
        }`
      }).pipe(map(value => (<any>value.data).getNeuronResponses)).subscribe((data) => {
        this.neuronResponses = data;
        // loop over the neuron responses and extract each visit 
        for (let index = 0; index < this.neuronResponses.length; index++) {
          let visit = this.neuronResponses[index].visit;
          const visitIndex = this.visitsNeuronResponses.findIndex(value => value.id == visit.id);
          if (visitIndex >= 0) {
            this.visitsNeuronResponses[visitIndex].neuronResponses.push(this.neuronResponses[index]);
          } else {
            // add new visit to the visitNeuronresponse
            // create a copy from the visit to avoid the rucursivity 
            let newVisit = new Visit();
            newVisit.id = visit.id;
            newVisit.createdAt = this.dataService.castFRDate(new Date(parseInt(visit.createdAt)));
            newVisit.neuronResponses.push(this.neuronResponses[index]);
  
            this.visitsNeuronResponses.push( newVisit);
          }
        }
      })
    }); 
   
  }

  selectVisit(visitResponse, i) {
    if (i == 0)
      return;

    if (visitResponse.id == this.expandVisit)
      this.expandVisit = null;
    else
      this.expandVisit = visitResponse.id;
  }
}
