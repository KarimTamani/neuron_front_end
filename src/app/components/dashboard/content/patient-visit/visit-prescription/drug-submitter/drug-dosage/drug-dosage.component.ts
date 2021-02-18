import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VisitDrugDosage } from 'src/app/classes/VisitDrugDosage';

@Component({
  selector: 'app-drug-dosage',
  templateUrl: './drug-dosage.component.html',
  styleUrls: ['./drug-dosage.component.css']
})
export class DrugDosageComponent implements OnInit {
  @Input() visitDrugDosage : VisitDrugDosage ; 
  @Output() deleteEvent : EventEmitter<VisitDrugDosage> ; 
  @Output() editEvent : EventEmitter<VisitDrugDosage> ; 
  constructor() {
    this.deleteEvent = new EventEmitter<VisitDrugDosage>() ; 
    this.editEvent = new EventEmitter<VisitDrugDosage>() ; 
  }

  ngOnInit(): void {

  }

}
