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
  @Input() visit: Visit ;
  public edit: boolean = false;
  public submittedMedicalFile: MedicalFile;
  constructor(private apollo : Apollo) {
    this.visit = new Visit () ; 
    this.submittedMedicalFile = new MedicalFile() ; 
  }
  ngOnInit(): void {

  }

  selectMedicalFile($event) {
    this.visit.medicalFile = $event;
    this.submittedMedicalFile = new MedicalFile() ; 
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
    console.log(this.visit.clinicalExam) ; 
    this.apollo.mutate({
      mutation : gql`
        mutation ($symptoms : [ID!] , $clinicalExam :String , $medicalActs : [ID!]! , $vitalSetting : VitalSettingInput)
        {
          editVisit(visitId : ${this.visit.id} , visit : {
            symptoms : $symptoms
            medicalActs : $medicalActs 
            vitalSetting : $vitalSetting 
            clinicalExam : $clinicalExam
          })
        }
      `,variables : {
        symptoms : this.visit.symptoms.map(value => value.id) , 
        medicalActs : this.visit.medicalActs.map(value => value.id) , 
        vitalSetting : (this.isVitalSettingEdited()) ? (this.visit.vitalSetting) : (null) , 
        clincalExam : (this.visit.clinicalExam && this.visit.clinicalExam.trim().length > 3) ? (this.visit.clinicalExam) : (null)
      }
    }).subscribe((data) => {

    })
  }


  private isVitalSettingEdited() {
    var keys = Object.keys(this.visit.vitalSetting) ; 
    return keys.length > 0 ; 
  }

}
