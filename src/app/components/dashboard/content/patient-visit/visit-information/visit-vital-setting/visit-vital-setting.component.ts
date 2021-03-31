import { Component, OnInit, Input } from '@angular/core';
import { VitalSetting } from 'src/app/classes/VitalSetting';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-vital-setting',
  templateUrl: './visit-vital-setting.component.html',
  styleUrls: ['./visit-vital-setting.component.css']
})
export class VisitVitalSettingComponent implements OnInit {
  @Input() vitalSetting: VitalSetting;
  @Input() active: boolean = false;
  public imc: number;
  public interpretation: string;
  constructor(private dataService: DataService, private router: Router, private interactionService: InteractionService) { }

  ngOnInit(): void {
    this.interpretateIMC();
  }
  private interpretateIMC() {
    if (this.vitalSetting.weight && this.vitalSetting.size) {
      this.imc = this.dataService.calculateImc(this.vitalSetting.weight, this.vitalSetting.size);
      this.interpretation = this.dataService.getImcInterpretation(this.imc);
    }

  }
  openVitalSetting() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "vital-setting",
        "vital-setting": encodeURIComponent(JSON.stringify(this.vitalSetting)),
        "title": "Modifier les paramétres vitaux"
      }
    });
    const subscription = this.interactionService.vitalSettingEdited.subscribe((data) => {
      if (this.vitalSettingChanged(this.vitalSetting , data)) { 
        this.interactionService.visitEdited.next() ; 
      }
      this.vitalSetting = data;
      subscription.unsubscribe();
      this.interpretateIMC();
    })
  }

  private vitalSettingChanged(a: VitalSetting, b: VitalSetting) {
    return a.bloodPressure !== b.bloodPressure ||
      a.cardiacFrequency !== b.cardiacFrequency ||
      a.diuresis !== b.diuresis ||
      a.obesity !== b.obesity ||
      a.respiratoryRate !== b.respiratoryRate ||
      a.size !== b.size ||
      a.smoker !== b.smoker ||
      a.temperature !== b.temperature ||
      a.weight !== b.weight
  }

}
