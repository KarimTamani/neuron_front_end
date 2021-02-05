import { Component, OnInit, Input } from '@angular/core';
import { VitalSetting } from 'src/app/classes/VitalSetting';

@Component({
  selector: 'app-vital-setting',
  templateUrl: './vital-setting.component.html',
  styleUrls: ['./vital-setting.component.css']
})
export class VitalSettingComponent implements OnInit {
  @Input() vitalSetting : VitalSetting ; 
  constructor() {

  }

  ngOnInit(): void {
    
  }

}
