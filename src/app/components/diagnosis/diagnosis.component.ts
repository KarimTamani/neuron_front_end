import { Component, OnInit } from '@angular/core';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { map } from "rxjs/operators"
import { ActivatedRoute } from '@angular/router';
import { Visit } from 'src/app/classes/Visit';
import { Symptom } from 'src/app/classes/Symptom';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-diagnosis',
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent implements OnInit {
  // init search query , search result , and the symptoms array  
  // init the selected Symptoms
  public visit: Visit;
  public showResult: boolean = false;
  public selectedSymptoms: any[] = []
  public predictions: any = null;
  public allSymptoms: Symptom[] = [];
  public bodyParts: any[] = [];

  public newResult: boolean = false;
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

  constructor(private apollo: Apollo,
    private route: ActivatedRoute,
    private virtualAssistantService: VirtualAssistantService,
    private interactionService: InteractionService) { }

  ngOnInit(): void {

    var params = this.route.snapshot.queryParams

    this.visit = JSON.parse(decodeURIComponent(params.visit));

    if (this.visit.symptoms) {
      this.selectedSymptoms = this.visit.symptoms;
      this.updateBodyAreaSymptoms(false);
    };


    this.apollo.query({
      query: gql`
      {
        getAllBodyParts {
          id
          name
          symptoms {
            id
            name
            bodyPartId
          }
        }
      }`
    }).pipe(map(value => (<any>value.data).getAllBodyParts)).subscribe((data) => {
      
      this.bodyParts = data;
      this.bodyParts.forEach(part => this.allSymptoms = this.allSymptoms.concat(part.symptoms));
      
      if (params.symptoms && params.result) {
        this.selectedSymptoms = this.loadSymptomsFromString(decodeURIComponent(params.symptoms));
        this.updateBodyAreaSymptoms();

        this.predictions = JSON.parse(decodeURIComponent(params.result))[0].output.predictions
        this.showResult = true;
      }
    })

    this.virtualAssistantService.onVACommand.subscribe((command) => {
      if (command.component == "DIAGNOSIS") {

        var symptoms = this.loadSymptomsFromString(command.default);
        if (symptoms && symptoms.length > 0) {
          this.selectedSymptoms = this.selectedSymptoms.concat(symptoms);
          this.updateBodyAreaSymptoms();
        }
      }
    })


  }


  private updateBodyAreaSymptoms(emit = true) {
    // update the body area symptoms each time a new symptom added or deleted
    // empty the symptoms 
    if (emit)
      this.interactionService.updateVisitSymptoms.next(this.selectedSymptoms);
    this.bodyAreaSymptoms.clear();
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

  private loadSymptomsFromString(str) {
    var symptoms = [];
    for (let index = 0; index < this.allSymptoms.length; index++) {

      // check if the symptom exists in the command 
      if (str.includes(this.allSymptoms[index].name)) {
        let i = 0;
        // if so check if the small symptom exists replace it 
        // if it's the small symptom break 
        // and dont add it 
        for (; i < symptoms.length; i++) {

          if (this.allSymptoms[index].name.includes(symptoms[i].name)) {

            symptoms[i] = this.allSymptoms[index];
            break;
          }

          if (symptoms[i].name.includes(this.allSymptoms[index].name)) {
            break;
          }
        }
        // if we reach the and without a mach then the symp do not exists ; 
        if (i == symptoms.length)
          symptoms.splice(0, 0, this.allSymptoms[index]);
      }
    }
    return symptoms;
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
            visitId : ${this.visit.id}
            input : "${symptoms}" , 
            models : ["SYMPTOMS_CLASSIFIER"]
          })
        }
      `
    }).pipe(map(result => (<any>result.data).performNeuronRequest)).subscribe((data: string) => {
      this.predictions = JSON.parse(data)[0].output.predictions;
      this.showResult = true;
      this.newResult = true;
    })
  }
}

