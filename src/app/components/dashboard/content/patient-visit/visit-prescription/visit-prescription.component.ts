import { Component, Input, OnInit } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { VisitDrugDosage } from 'src/app/classes/VisitDrugDosage';

@Component({
  selector: 'app-visit-prescription',
  templateUrl: './visit-prescription.component.html',
  styleUrls: ['./visit-prescription.component.css']
})
export class VisitPrescriptionComponent implements OnInit {
  public navigationOption : number = 1 ; 
  @Input() visit : Visit  ; 
  constructor() { }

  ngOnInit(): void {
  
  }

}
