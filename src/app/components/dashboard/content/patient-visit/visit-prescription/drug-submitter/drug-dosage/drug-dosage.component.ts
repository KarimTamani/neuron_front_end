import { Component, Input, OnInit } from '@angular/core';
import { VisitDrugDosage } from 'src/app/classes/VisitDrugDosage';

@Component({
  selector: 'app-drug-dosage',
  templateUrl: './drug-dosage.component.html',
  styleUrls: ['./drug-dosage.component.css']
})
export class DrugDosageComponent implements OnInit {
  @Input() visitDrugDosage : VisitDrugDosage ; 
  constructor() { }

  ngOnInit(): void {
    console.log(this.visitDrugDosage) ;
  }

}
