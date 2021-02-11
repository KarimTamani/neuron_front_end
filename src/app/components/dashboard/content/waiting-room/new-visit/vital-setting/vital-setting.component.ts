import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VitalSetting } from 'src/app/classes/VitalSetting';
import { ActivatedRoute } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-vital-setting',
  templateUrl: './vital-setting.component.html',
  styleUrls: ['./vital-setting.component.css']
})
export class VitalSettingComponent implements OnInit {
  @Input() vitalSetting : VitalSetting ; 
  public fromRouter : boolean = false ; 
  @Output() closeEvent : EventEmitter<null> ; 
  constructor(private  route : ActivatedRoute , private interactionService : InteractionService) {
    this.closeEvent = new EventEmitter<null>() ; 
  } 

  ngOnInit(): void {
    
    if (this.vitalSetting == null) { 
      this.fromRouter = true ; 
      this.route.queryParams.subscribe((params) => {
        this.vitalSetting = JSON.parse(decodeURIComponent(params["vital-setting"])) ; 
      })
    }
  }

  public edit () { 
    this.interactionService.vitalSettingEdited.next(this.vitalSetting) ; 
    this.closeEvent.emit() ; 
  }

}
