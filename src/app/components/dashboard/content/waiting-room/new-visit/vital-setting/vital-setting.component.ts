import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VitalSetting } from 'src/app/classes/VitalSetting';
import { ActivatedRoute } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';

@Component({
  selector: 'app-vital-setting',
  templateUrl: './vital-setting.component.html',
  styleUrls: ['./vital-setting.component.css']
})
export class VitalSettingComponent implements OnInit {
  @Input() vitalSetting: VitalSetting;
  public fromRouter: boolean = false;
  @Output() closeEvent: EventEmitter<null>;
  constructor(
    private route: ActivatedRoute,
    private interactionService: InteractionService,
    private virtualAssistantService: VirtualAssistantService) {
    this.closeEvent = new EventEmitter<null>();
  }

  ngOnInit(): void {
    this.virtualAssistantService.onVACommand.subscribe((data) => {
      if (data.component == "VITAL-SETTING") {
        if ( data.respiratoryRate) 
          this.vitalSetting.respiratoryRate = data.respiratoryRate  ; 
          
        if (data.bloodPressure)
          this.vitalSetting.bloodPressure = data.bloodPressure;
        if (data.cardiacFrequency)
          this.vitalSetting.cardiacFrequency = data.cardiacFrequency;
        if (data.size)
          this.vitalSetting.size = data.size;
        if (data.weight)
          this.vitalSetting.weight = data.weight;
        if (data.diuresis)
          this.vitalSetting.diuresis = data.diuresis;
        if (data.temperature)
          this.vitalSetting.temperature = data.temperature;
        if (data.smoker)
          this.vitalSetting.smoker = data.smoker;
        if (data.obesity)
          this.vitalSetting.obesity = data.obesity;
      }
    })
    if (this.vitalSetting == null) {
      this.fromRouter = true;
      this.route.queryParams.subscribe((params) => {
        this.vitalSetting = JSON.parse(decodeURIComponent(params["vital-setting"]));
      })
    }
  }

  public edit() {
    this.interactionService.vitalSettingEdited.next(this.vitalSetting);
    this.closeEvent.emit();
  }

}
