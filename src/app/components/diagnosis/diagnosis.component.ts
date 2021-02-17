import { Component, OnInit } from '@angular/core';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from "rxjs/operators"
import { ActivatedRoute } from '@angular/router';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {
  // init search query , search result , and the symptoms array  
  // init the selected Symptoms
  public visit : Visit ; 
  public showResult: boolean = false;
  public selectedSymptoms: any[] = []
  public predictions: any = null;
  // global body part symptoms to allocate each symptom in his properiate body area   
  public bodyAreaSymptoms = {
    head: [],
    chest: [],
    abdomin: [],
    arms: [],
    legs: [],
    clear: () => {
      this.bodyAreaSymptoms.head = []
      this.bodyAreaSymptoms.chest = []
      this.bodyAreaSymptoms.abdomin = []
      this.bodyAreaSymptoms.arms = []
      this.bodyAreaSymptoms.legs = []
    }
  }
  // select either all symptoms list or search for a semptoms 
  public symptomsControllerMode: boolean = true;
  constructor(private apollo: Apollo , private route : ActivatedRoute) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => { 
      this.visit = JSON.parse(decodeURIComponent(params.visit)) ; 
      this.selectedSymptoms = this.visit.symptoms ; 
      this.updateBodyAreaSymptoms() ; 
    })
  }


  private updateBodyAreaSymptoms() {
    // update the body area symptoms each time a new symptom added or deleted
    // empty the symptoms 
    this.bodyAreaSymptoms.clear()
    for (let index = 0; index < this.selectedSymptoms.length; index++)
      switch (parseInt(this.selectedSymptoms[index].bodyPartId)) {
        case 1:
          this.bodyAreaSymptoms.head.push(this.selectedSymptoms[index]);
          break;
        case 2:
          this.bodyAreaSymptoms.chest.push(this.selectedSymptoms[index]);
          break;
        case 3:
          this.bodyAreaSymptoms.abdomin.push(this.selectedSymptoms[index]);
          break;
        case 4:
          this.bodyAreaSymptoms.arms.push(this.selectedSymptoms[index])
          break;
        case 5:
          this.bodyAreaSymptoms.legs.push(this.selectedSymptoms[index]);
          break;
        default:
          break;
      }

  }

  diagnosis() {
    if (this.selectedSymptoms.length == 0)
      return;

    var symptoms: any = this.selectedSymptoms.map((value) => value.name)
    symptoms = symptoms.join(',')
    
    this.apollo.mutate({
      mutation: gql`
        mutation{
          performNeuronRequest(request : {
            input : "${symptoms}" , 
            models : ["SYMPTOMS_CLASSIFIER"]
          })
        }
      `
    }).pipe(map(result => (<any>result.data).performNeuronRequest)).subscribe((data : string) => {
      this.predictions = JSON.parse(data)[0].output.predictions ;
      this.showResult = true ; 
    })
  }
}

