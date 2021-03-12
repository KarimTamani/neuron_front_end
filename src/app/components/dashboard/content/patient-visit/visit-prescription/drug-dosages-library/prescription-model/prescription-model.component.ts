import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrescriptionModel } from 'src/app/classes/PrescriptionModel';

@Component({
  selector: 'app-prescription-model',
  templateUrl: './prescription-model.component.html',
  styleUrls: ['./prescription-model.component.css']
})
export class PrescriptionModelComponent implements OnInit {
  @Input() prescriptionModel : PrescriptionModel ; 
  @Output() useEvent : EventEmitter<PrescriptionModel>;
  @Output() editEvent : EventEmitter<PrescriptionModel> ;  
  @Output() deleteEvent : EventEmitter<PrescriptionModel> ; 
  public expand : boolean = false  ; 
  constructor() {
    this.useEvent = new EventEmitter<PrescriptionModel>() ; 
    this.editEvent = new EventEmitter<PrescriptionModel>() ; 
    this.deleteEvent = new EventEmitter<PrescriptionModel>() ; 
  }

  ngOnInit(): void {
  }


}
