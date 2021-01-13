import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-general-waiting-room-patient',
  templateUrl: './general-waiting-room-patient.component.html',
  styleUrls: ['./general-waiting-room-patient.component.css']
})
export class GeneralWaitingRoomPatientComponent implements OnInit {
  @Input() patient : any = null ; 
  constructor() { }

  ngOnInit(): void {
  }
  

}
