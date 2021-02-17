import { Component, Input, OnInit } from '@angular/core';
import { VisitDrugDosage } from 'src/app/classes/VisitDrugDosage';

@Component({
  selector: 'app-prescription-drug-dosage',
  templateUrl: './prescription-drug-dosage.component.html',
  styleUrls: ['./prescription-drug-dosage.component.css']
})
export class PrescriptionDrugDosageComponent implements OnInit {
  @Input() visitDrugDosage : VisitDrugDosage ;  
  constructor() { }

  ngOnInit(): void {
    console.log(this.visitDrugDosage) ; 
  }

}
