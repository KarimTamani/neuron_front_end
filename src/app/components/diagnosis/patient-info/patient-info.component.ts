import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit {
  public patient : any = {
    name  : "Prénom" , 
    lastname : "Nom" , 
    birthday : "11-30-1996" , 
    height : 187 , 
    weight : 80 , 
    gender : true 
  }
  public imc : number = 0 ; 
  public age : number = 0 ; 
  public interpretation

  constructor(private dataService : DataService) { }

  ngOnInit(): void {
    this.imc = this.dataService.calculateImc(this.patient.weight , this.patient.height) ; 
    this.interpretation = this.dataService.getImcInterpretation(this.imc) ; 
    this.age = this.dataService.calculateAge(this.patient.birthday) ; 
  }
  
}
