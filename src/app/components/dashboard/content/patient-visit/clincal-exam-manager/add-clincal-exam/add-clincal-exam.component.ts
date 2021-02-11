import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ClinicalExam} from "../../../../../../classes/ClincalExam"  ; 
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-add-clincal-exam',
  templateUrl: './add-clincal-exam.component.html',
  styleUrls: ['./add-clincal-exam.component.css']
})
export class AddClincalExamComponent implements OnInit {
  public form : FormGroup = new FormGroup({
    name : new FormControl("" , [
      Validators.required , Validators.minLength(3)
    ]) , 
    exam : new FormControl("" , [
      Validators.required , Validators.minLength(3)
    ])
  }) ; 
  public clinicalExam : ClinicalExam ; 
  @Output() addClincalExamEvent : EventEmitter<ClinicalExam> ; 
  @Output() closeEvent : EventEmitter<null> ; 
  constructor(private apollo : Apollo) {
    // init the clincal exam 
    // and the clincal exam add event
    this.clinicalExam = new ClinicalExam() ; 
    this.addClincalExamEvent = new EventEmitter<ClinicalExam>();  
    this.closeEvent = new EventEmitter<null>() ; 
  }

  ngOnInit(): void {
  }

  public addClinicalExam()  {
  
    this.apollo.mutate({
      mutation : gql`
        mutation ADD_CLINICAL_EXAM ($name : String! , $exam : String!){
          addClinicalExam(clinicalExam : {
            name : $name , 
            exam : $exam 
          }) {
            id 
            name
            exam
          }
        }
      ` , variables : {
        name : this.clinicalExam.name , 
        exam : this.clinicalExam.exam 
      }
    }).pipe(map(value => (<any>value.data).addClinicalExam)).subscribe((data) => {
      this.addClincalExamEvent.emit(data) ; 
      this.clinicalExam = new ClinicalExam() ; 
      this.closeEvent.emit()
    })
  }
}
