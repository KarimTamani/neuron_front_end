import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MedicalAct } from 'src/app/classes/MedicalAct';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Visit } from 'src/app/classes/Visit';
import { Symptom } from 'src/app/classes/Symptom';
import { MedicalFile } from 'src/app/classes/MedicalFile';

@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.component.html',
  styleUrls: ['./new-visit.component.css']
})
export class NewVisitComponent implements OnInit {
  @Output() closeEvent: EventEmitter<null>;
  public medicalActs: MedicalAct[] = [];
  public visit: Visit;
  public selectedMedicalActs: MedicalAct[] = [];
  public totalPrice: number = 0;
  public submittedSymptom: Symptom;
  public submittedMedicalFile: MedicalFile;
  public symptoms: Symptom[] = [];
  public showNewMedicalFile : boolean = false ; 
  constructor(private apollo: Apollo) {
    this.closeEvent = new EventEmitter<null>();
    this.visit = new Visit();
    this.submittedSymptom = new Symptom();
    this.submittedMedicalFile = new MedicalFile();
  }

  ngOnInit(): void {
    // get the medical acts to calculate the price of the visit
    this.apollo.query({
      query: gql`
        { 
          getAllMedicalActs {
            id name price
          } 
        } `
    }).pipe(map(value => (<any>value.data).getAllMedicalActs)).subscribe((data) => {
      this.medicalActs = data;
    })
  }

  public searchFunction: any = (query) => {
    // define the search medical files function
    return this.apollo.query({
      query: gql`
          {
            searchMedicalFiles(searchQuery : "${query}") {
              id 
              name 
              lastname 
              phone 
              email 
              birthday 
            }
          }`
    }).pipe(map(result => (<any>result.data).searchMedicalFiles));
  }

  public symptomsSearchFunction: any = (query) => {
    // search for symptoms by name
    return this.apollo.query({
      query: gql`
        {
          searchSymptom(symptom : "${query}") { 
            id name 
          }
        }`
    }).pipe(map(value => (<any>value.data).searchSymptom));
  }

  public isMedicalActSelected(medicalAct) {
    let index = this.selectedMedicalActs.findIndex(value => value.id == medicalAct.id);
    return index >= 0;
  }

  public selectMedicalAct(medicalAct) {
    // if the medical act is allready selected remove it 
    // else push it 
    let index = this.selectedMedicalActs.findIndex(value => value.id == medicalAct.id);
    if (index >= 0) {
      this.selectedMedicalActs.splice(index, 1);
    } else
      this.selectedMedicalActs.push(medicalAct);
    // calculate the total price of the visit 
    this.totalPrice = 0;
    this.selectedMedicalActs.forEach((act) => {
      this.totalPrice += act.price;
    })
  }

  symptomSelected($event) {

    this.apollo.mutate({
      mutation: gql`
        mutation { 
          addSymptom(symptom : { 
            name : "${$event.name}"
          }) {
            id name 
          }
        }
      `
    }).pipe(map((response) => (<any>response.data).addSymptom)).subscribe((data) => {
      this.symptoms.splice(0, 0, data);
    })
  }
  removeSymptom(symptom) {
    const index = this.symptoms.findIndex((value) => value.id == symptom.id);
    this.symptoms.splice(index, 1);
  }
}
