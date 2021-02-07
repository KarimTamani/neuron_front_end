import { Component, OnInit, Input } from '@angular/core';
import { VitalSetting } from 'src/app/classes/VitalSetting';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-visit-vital-setting',
  templateUrl: './visit-vital-setting.component.html',
  styleUrls: ['./visit-vital-setting.component.css']
})
export class VisitVitalSettingComponent implements OnInit {
  @Input() vitalSetting: VitalSetting;
  public imc: number;
  public interpretation: string;
  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    if (this.vitalSetting.weight && this.vitalSetting.size) {
      this.imc = this.dataService.calculateImc(this.vitalSetting.weight, this.vitalSetting.size);
      this.interpretation = this.dataService.getImcInterpretation(this.imc) ; 
    }
  }

}
