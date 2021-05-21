import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClinicalExam } from 'src/app/classes/ClincalExam';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-clincal-exam-list',
  templateUrl: './clincal-exam-list.component.html',
  styleUrls: ['./clincal-exam-list.component.css']
})
export class ClincalExamListComponent implements OnInit {
  @Input() clinicalExams: ClinicalExam[] = [];
  @Output() addExamEvent: EventEmitter<null>;
  @Output() closeEvent : EventEmitter<null> ; 
  @Output() editExam : EventEmitter<ClinicalExam> ; 

  public selectedExam: ClinicalExam;

  constructor(private interactionService : InteractionService) {
    this.addExamEvent = new EventEmitter<null>();
    this.closeEvent = new EventEmitter<null>() ; 
    this.editExam = new EventEmitter<ClinicalExam>() ; 

  }

  ngOnInit(): void { 
  }
  selectClinicalExam(clinicalExam) {
    if (this.selectedExam && this.selectedExam.id == clinicalExam.id)
      this.selectedExam = null
    else
      this.selectedExam = clinicalExam;
  }



  public use(clinicalExam) {
    this.interactionService.useClinicalExam.next(clinicalExam) ; 
    this.closeEvent.emit() ; 
  }

  public edit($event , clinicalExam) { 

    $event.stopPropagation() ; 

    this.editExam.emit(clinicalExam)
  }

  public delete($event ,  clinicalExam) { 

    $event.stopPropagation() ; 
  }
}
