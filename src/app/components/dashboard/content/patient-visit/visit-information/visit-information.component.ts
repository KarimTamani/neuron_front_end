import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { FAIL, Message } from 'src/app/classes/Message';
import { Visit } from 'src/app/classes/Visit';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-information',
  templateUrl: './visit-information.component.html',
  styleUrls: ['./visit-information.component.css']
})
export class VisitInformationComponent implements OnInit {
  @Input() visit: Visit;
  @Input() isEdit : boolean = false;  
  @Output() visitSelectedEvent : EventEmitter<Visit>  ; 
  
  @Output() saveVisitEvent : EventEmitter<Visit> ; 
  @Output() editVisitEvent : EventEmitter<Visit> ; 
  public validMedicalActs : boolean = true ;
  
  constructor(private apollo: Apollo, private interactionService: InteractionService) {
    this.visitSelectedEvent = new EventEmitter<Visit>() ; 
    
    this.saveVisitEvent = new EventEmitter<Visit>() ; 
    this.editVisitEvent = new EventEmitter<Visit>() ; 
  }
  ngOnInit(): void { 
    this.interactionService.vitalSettingEdited.subscribe((data) => {
      this.visit.vitalSetting = data;
    })
  }
  public visitSelected($event) { 
    this.visit = $event ; 
    this.visitSelectedEvent.emit(this.visit) ; 
  }

  public save($event) { 
    if (this.visit.medicalActs.length == 0) { 
      this.validMedicalActs = false ; 
      this.interactionService.showMessage.next(<Message>{
        message : "choisissez un act medical" , 
        type : FAIL
      })
      return ; 
    }
    this.saveVisitEvent.emit($event) ; 
  }

  public edit($event ) { 
    if (this.visit.medicalActs.length == 0) { 
      this.validMedicalActs = false ; 
      this.interactionService.showMessage.next(<Message>{
        message : "choisissez un act medical" , 
        type : FAIL
      }) 
      return ; 
    }
    this.editVisitEvent.emit($event) ; 
  
  }

}
