import { Component, OnInit, Output, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-visit-loader',
  templateUrl: './visit-loader.component.html',
  styleUrls: ['./visit-loader.component.css']
})
export class VisitLoaderComponent implements OnInit {
  @Input() visit: Visit;
  public edit: boolean = false;
  public submittedMedicalFile: MedicalFile;
  constructor(private apollo: Apollo) {
    this.visit = new Visit();
    this.submittedMedicalFile = new MedicalFile();
  }
  ngOnInit(): void {
    console.log(this.visit.condition);
  }

  selectMedicalFile($event) {
    this.visit.medicalFile = $event;
    this.submittedMedicalFile = new MedicalFile();

  }
  public searchCondtion: any = (query) => {
    // search for conditions and diseases 
    return this.apollo.query({
      query: gql`
        { 
          searchConditions(name : "${query}") { 
            id name
          }
        }
      `
    }).pipe(map(value => (<any>value.data).searchConditions));
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
              gender
            }
          }`
    }).pipe(map(result => (<any>result.data).searchMedicalFiles));
  }

  public saveVsit() {
    this.apollo.mutate({
      mutation: gql`
        mutation ($symptoms : [ID!] , $clinicalExam :String , $medicalActs : [ID!]! , $vitalSetting : VitalSettingInput , $condition : ConditionInput)
        {
          editVisit(visitId : ${this.visit.id} , visit : {
            symptoms : $symptoms
            medicalActs : $medicalActs 
            vitalSetting : $vitalSetting 
            clinicalExam : $clinicalExam
            condition : $condition
          })
        }
      `, variables: {
        symptoms: this.visit.symptoms.map(value => value.id),
        medicalActs: this.visit.medicalActs.map(value => value.id),
        vitalSetting: (this.isVitalSettingEdited()) ? (this.visit.vitalSetting) : (null),
        clinicalExam: (this.visit.clinicalExam && this.visit.clinicalExam.trim().length > 3) ? (this.visit.clinicalExam) : (null),
        condition: (this.visit.condition && this.visit.condition.name.trim().length > 0) ? ({
          name: this.visit.condition.name
        }) : (null)
      }
    }).subscribe((data) => {

    })

  }


  private isVitalSettingEdited() {
    var keys = Object.keys(this.visit.vitalSetting);
    return keys.length > 0;
  }

}
