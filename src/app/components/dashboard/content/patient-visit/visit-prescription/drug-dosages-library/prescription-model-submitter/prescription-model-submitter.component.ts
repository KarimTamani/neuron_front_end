import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-prescription-model-submitter',
  templateUrl: './prescription-model-submitter.component.html',
  styleUrls: ['./prescription-model-submitter.component.css']
})
export class PrescriptionModelSubmitterComponent implements OnInit {
  @Output() closeEvent : EventEmitter<null> ; 
  constructor() {
    this.closeEvent = new EventEmitter<null>() ; 
  }

  ngOnInit(): void {
  }

}
