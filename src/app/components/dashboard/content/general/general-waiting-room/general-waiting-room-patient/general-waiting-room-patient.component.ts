import { Component, OnInit, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-general-waiting-room-patient',
  templateUrl: './general-waiting-room-patient.component.html',
  styleUrls: ['./general-waiting-room-patient.component.css']
})
export class GeneralWaitingRoomPatientComponent implements OnInit {
  @Input() visit: Visit;
  public age : number ; 
  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    
    this.age = this.dataService.calculateAge(this.visit.medicalFile.birthday , new Date(parseInt ( this.visit.createdAt))) ; 
   
  
  }


}
