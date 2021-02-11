import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ClinicalExam} from "../../../../../classes/ClincalExam" ; 
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-clincal-exam-manager',
  templateUrl: './clincal-exam-manager.component.html',
  styleUrls: ['./clincal-exam-manager.component.css']
})
export class ClincalExamManagerComponent implements OnInit {
  @Output() closeEvent : EventEmitter<null> ; 
  public addClincalExam : boolean = true ; 
  public clinicalExams : ClinicalExam[] = [] ; 
  constructor(private apollo : Apollo) {
    this.closeEvent = new EventEmitter<null>() ; 
  }

  ngOnInit(): void {
    this.apollo.query({
      query : gql`
        {
          getAllClinicalExams {
            id name exam 
          }
        }
      `
    }).pipe(map(value => (<any>value.data).getAllClinicalExams)).subscribe((data) => {
      this.clinicalExams = data ; 
     
    })
  }
  onAddClinicalExam($event) {
    this.clinicalExams.splice(0 , 0  , $event) ; 
  }
} 
