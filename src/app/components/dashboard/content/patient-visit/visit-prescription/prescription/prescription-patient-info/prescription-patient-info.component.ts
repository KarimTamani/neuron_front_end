import { Component, Input, OnInit } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-prescription-patient-info',
  templateUrl: './prescription-patient-info.component.html',
  styleUrls: ['./prescription-patient-info.component.css']
})
export class PrescriptionPatientInfoComponent implements OnInit {
  @Input() visit : Visit ; 
  public visitDate : string ; 
  public age : number = 0 ; 
  constructor(private dataService : DataService) { }

  ngOnInit(): void {
  
    const createdAtDate = new Date(parseInt ( this.visit.createdAt ) ) ; 
    const day = createdAtDate.getDate() ; 
    const month = createdAtDate.getMonth() ; 
    const year = createdAtDate.getFullYear() ; 
    
    this.visitDate = `${day} ${this.dataService.monthes[month]} ${year}`
    this.age = this.dataService.calculateAge(this.visit.medicalFile.birthday , createdAtDate ) ; 

  
  }

}
