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
  public addClincalExam : boolean = false  ; 
  public clinicalExams : ClinicalExam[] = [] ;
  public editedExam : ClinicalExam = null ;  
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


  public editExam($event) { 
    this.editedExam = $event ; 
    this.addClincalExam = true ;   
  }

  public editClinicalExam($event) { 
    this.editedExam = null 
    this.addClincalExam = false ;
    var index = this.clinicalExams.findIndex(value => value.id == $event.id) ; 
    if (index >= 0 ) { 
      this.clinicalExams[index] = $event ; 
    }   
  
  }
} 
