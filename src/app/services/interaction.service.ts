import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Service } from '../classes/Service';
import { Assistant } from '../classes/Assistant';
import { MedicalAct } from '../classes/MedicalAct';
import { Visit } from '../classes/Visit';
import { VitalSetting } from '../classes/VitalSetting';
import { ClinicalExam } from '../classes/ClincalExam';
import { Appointment } from '../classes/Appointment';
import { Expense } from '../classes/Expense';
import { PrescriptionModel } from '../classes/PrescriptionModel';
import { Document } from '../classes/Document';
import { SubjectSubscriber } from 'rxjs/internal/Subject';
import { CertificatModel } from '../classes/CertificatModel';
import { MedicalFile } from '../classes/MedicalFile';
import { Message } from '../classes/Message';

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
  public vitalSettingEdited: Subject<VitalSetting>;
  public useClinicalExam: Subject<ClinicalExam>;
  public advancedSearchValidated: Subject<any>;
  public newAppointmentAdded: Subject<Appointment>;
  public newExpenseAdded: Subject<Expense>;
  public editExpense: Subject<Expense>;
  public addprescriptionModel: Subject<PrescriptionModel>;
  public editPrescriptionModel: Subject<PrescriptionModel>;
  public documentAdded: Subject<Document>;
  public documentEdit: Subject<Document>;
  public certificatModelSelected: Subject<CertificatModel>;
  public newMedicalFile: Subject<MedicalFile>;
  public visitEdited: Subject<null>;
  public visitDeleted: Subject<Visit>;
  public medicalFileDeleted: Subject<MedicalFile>;
  public openEditVisitWindow : Subject<Visit> ; 
  public showMessage : Subject<Message> ; 
  constructor() {
    this.askForPremiumRequestSubject = new Subject<null>();
    this.updateService = new Subject<Service[]>();
    this.yesOrNo = new Subject<boolean>();
    this.assistantCreated = new Subject<Assistant>();
    this.medicalActCreated = new Subject<MedicalAct>();
    this.medicalActEdited = new Subject<MedicalAct>();
    this.newVisitAdded = new Subject<null>();
    this.visitPayed = new Subject<Visit>();
    this.updateReport = new Subject<null>();
    this.vitalSettingEdited = new Subject<VitalSetting>();
    this.useClinicalExam = new Subject<ClinicalExam>();
    this.advancedSearchValidated = new Subject<any>();
    this.newAppointmentAdded = new Subject<Appointment>();
    this.newExpenseAdded = new Subject<Expense>();
    this.editExpense = new Subject<Expense>();
    this.addprescriptionModel = new Subject<PrescriptionModel>();
    this.editPrescriptionModel = new Subject<PrescriptionModel>();
    this.documentAdded = new Subject<Document>();
    this.documentEdit = new Subject<Document>();
    this.certificatModelSelected = new Subject<CertificatModel>();
    this.newMedicalFile = new Subject<MedicalFile>();
    this.visitEdited = new Subject<null>();
    this.visitDeleted = new Subject<Visit>();
    this.medicalFileDeleted = new Subject<MedicalFile>() ; 
    this.openEditVisitWindow = new Subject<Visit>() ; 
    this.showMessage = new Subject<Message>() ; 
  }
}
