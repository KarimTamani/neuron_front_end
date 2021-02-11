import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Service } from '../classes/Service';
import { Assistant } from '../classes/Assistant';
import { MedicalAct } from '../classes/MedicalAct';
import { Visit } from '../classes/Visit';
import { VitalSetting } from '../classes/VitalSetting';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  public askForPremiumRequestSubject: Subject<null>;
  public updateService: Subject<Service[]>;
  public yesOrNo: Subject<boolean>;
  public assistantCreated: Subject<Assistant>;
  public medicalActCreated: Subject<MedicalAct>;
  public medicalActEdited: Subject<MedicalAct>;
  public newVisitAdded: Subject<null>;
  public visitPayed: Subject<Visit>;
  public updateReport: Subject<null>;
  public vitalSettingEdited : Subject<VitalSetting> ; 
  constructor() {
    this.askForPremiumRequestSubject = new Subject<null>();
    this.updateService = new Subject<Service[]>();
    this.yesOrNo = new Subject<boolean>();
    this.assistantCreated = new Subject<Assistant>();
    this.medicalActCreated = new Subject<MedicalAct>();
    this.medicalActEdited = new Subject<MedicalAct>();
    this.newVisitAdded = new Subject<null>();
    this.visitPayed = new Subject<Visit>();
    this.updateReport = new Subject<null>() ; 
    this.vitalSettingEdited = new Subject<VitalSetting>() ;  
  }


}
