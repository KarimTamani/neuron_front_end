import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClinicalExam } from 'src/app/classes/ClincalExam';

@Component({
  selector: 'app-clincal-exam-list',
  templateUrl: './clincal-exam-list.component.html',
  styleUrls: ['./clincal-exam-list.component.css']
})
export class ClincalExamListComponent implements OnInit {
  @Input() clinicalExams : ClinicalExam[] = [ ] ;
  @Output() addExamEvent : EventEmitter<null> ; 
  constructor() {
    this.addExamEvent = new EventEmitter<null>() ; 
  } 

  ngOnInit(): void {
  }

}
