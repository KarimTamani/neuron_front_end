import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Visit } from 'src/app/classes/Visit';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.css']
})
export class PatientInfoComponent implements OnInit {

  @Input() visit: Visit;


  public imc: number = 0;
  public age: number = 0;
  public interpretation

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    console.log(this.visit ) ; 
    // check if the weight and the size are both defined 
    if (this.visit.vitalSetting.weight && this.visit.vitalSetting.size) {
      this.imc = this.dataService.calculateImc(this.visit.vitalSetting.weight, this.visit.vitalSetting.size);
      this.interpretation = this.dataService.getImcInterpretation(this.imc);
    }
    this.age = this.dataService.calculateAge(this.visit.medicalFile.birthday);
  }

}
