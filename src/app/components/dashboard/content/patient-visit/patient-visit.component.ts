import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Visit } from 'src/app/classes/Visit';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Condition } from 'src/app/classes/Condition';
import { VitalSetting } from 'src/app/classes/VitalSetting';
import { InteractionService } from 'src/app/services/interaction.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';
import { DataService } from 'src/app/services/data.service';
import { Message, SUCCESS } from 'src/app/classes/Message';

@Component({
  selector: 'app-patient-visit',
  templateUrl: './patient-visit.component.html',
  styleUrls: ['./patient-visit.component.css']
})
export class PatientVisitComponent implements OnInit, OnDestroy {
  public page: number = 1;
  @Input() visit: Visit;
  @Input() noHeader: boolean = false;
  public subscriptions: Subscription[] = [];
  public isEdited: boolean = false;
  @Input() isEdit: boolean = false;
  @Output() closeEvent: EventEmitter<null>;

  constructor(
    private apollo: Apollo,
    private interactionService: InteractionService,
    private router: Router,
    private dataService: DataService,
    private virtualAssistantService: VirtualAssistantService) {

    this.visit = new Visit();
    this.closeEvent = new EventEmitter<null>();
  }

  ngOnInit(): void {

    this.virtualAssistantService.onVACommand.subscribe((data) => {
      if (data.component == "PATIENT-VISIT") {
        if (data.page && data.page == 7) {
          var date = this.dataService.frToYMDDate(data.appointment);
          if (date) {
            this.router.navigate([], {
              queryParams: {
                'pop-up-window': true,
                'window-page': 'visit-appointment',
                'title': "Le prochain rendez-vous",
                'visit': decodeURIComponent(JSON.stringify({
                  medicalFile: {
                    lastname: this.visit.medicalFile.lastname,
                    name: this.visit.medicalFile.name,

                  },
                  appointment: {
                    date: date
                  }
                }))
              }

            })
          }
        }
        else if (data.page && data.page != 2) {
          this.page = data.page;
        } else if (data.page == 2) {
          switch (data.diagnosis) {
            case 1:
              this.router.navigate([], {
                queryParams: {
                  'pop-up-window': true,
                  'window-page': 'diagnosis',
                  'title': "Diagnostic symptomatique",
                  'visit': encodeURIComponent(JSON.stringify(this.visit))
                }
              });
              break;
            case 2:
              this.router.navigate([], {
                queryParams: {
                  'pop-up-window': true,
                  'window-page': 'speciality-diagnosis',
                  'title': "Diagnostic Avancées",
                  'visit': encodeURIComponent(JSON.stringify(this.visit))
                }
              });
              break;
            case 3:
              this.page = 2;
              break;
          }

        }
      }
    })
    this.apollo.query({
      query: gql`
      { 
        getCurrentVisit {
          id
          waitingRoom {
            id
            date
          }
          appointment { 
            id date time 
          }
          waitingRoomId 
          arrivalTime
          status
          startTime 
          endTime 
          clinicalExam
          order 
          payedMoney 
          createdAt 
          updatedAt
          condition {
            id name
          }
          debt 
          medicalActs {
            id name price 
          }
          symptoms {
            id name bodyPartId
          }
          checkUps { id name checkUpTypeId }
          certificats { id html certificatModel { id type title}}
          vitalSetting { 
            temperature 
            respiratoryRate  
            cardiacFrequency 
            bloodPressure 
            diuresis 
            weight  
            size  
            obesity 
            smoker  
          }
          visitDrugDosages {
            dosage { name } drug { name } qsp unitNumber 
          }
          medicalFile {
            id
            birthday
            name 
            lastname 
            phone
            gender
            email
            address {
              id
              commune {
                name 
                wilaya {
                  id name 
                }
              }
            },
            antecedents { id name type}  
          }
        }
      }`
    }).pipe(map(value => (<any>value.data).getCurrentVisit)).subscribe((data) => {
      if (data)
        this.visit = data;
      this.initVisit();
    });
    this.subscriptions.push(this.interactionService.newAppointmentAdded.subscribe((data) => {
      this.visit.appointment = data;
      if (data)
        this.isEdited = true;
    }));

    this.subscriptions.push(this.interactionService.clearAppointment.subscribe(() => {
      if (this.visit.appointment)
        this.apollo.mutate({
          mutation: gql`
          mutation { 
            removeAppointment(appointmentId : ${this.visit.appointment.id}) 
          }
        `
        }).pipe(map(value => (<any>value.data).removeAppointment)).subscribe((data) => {
          this.visit.appointment = null;
        })

    }));


    this.subscriptions.push(this.interactionService.visitEdited.subscribe(() => {
      this.isEdited = true;
    }));

    this.subscriptions.push(this.interactionService.visitDone.subscribe((data) => {
      this.visit = new Visit();
      this.initVisit();
    }))

    this.subscriptions.push(this.interactionService.updateVisitSymptoms.subscribe((symptoms) => {
      this.visit.symptoms = symptoms;
      if (this.visit.symptoms.length != 0)
        this.isEdited = true;
    }))


    this.subscriptions.push(this.interactionService.medicalFileEdited.subscribe((data) => {
      this.visit.medicalFile = data;
    }))
  }

  private initVisit() {
    if (this.visit.condition == null)
      this.visit.condition = new Condition();
    if (this.visit.visitDrugDosages == null)
      this.visit.visitDrugDosages = [];
    if (this.visit.vitalSetting == null)
      this.visit.vitalSetting = new VitalSetting();
    if (this.visit.medicalActs == null)
      this.visit.medicalActs = [];
    if (this.visit.symptoms == null)
      this.visit.symptoms = [];
    if (this.visit.checkUps == null)
      this.visit.checkUps = [];
    if (this.visit.documents == null)
      this.visit.documents = [];
    if (this.visit.certificats == null)
      this.visit.certificats = [];
  }
  select($event) {
    this.page = $event;
  }

  public visitSelected($event) {
    this.visit = $event;
    this.initVisit();
  }
  public save($event) {

    this.visit = $event;
    this.apollo.mutate({
      mutation: gql`
        mutation ADD_VISIT($waitingRoomId : ID! ,  $vitalSetting : VitalSettingInput , $medicalFileId : ID! , $clinicalExam : String , $symptoms : [ID!] , $medicalActs : [ID!]! ,  $condition : ConditionInput , $status : String){ 
          addVisit (visit : { 
            waitingRoomId : $waitingRoomId , 
            medicalFileId : $medicalFileId , 
            clinicalExam : $clinicalExam , 
            symptoms : $symptoms ,
            medicalActs : $medicalActs 
            vitalSetting : $vitalSetting , 
            condition  : $condition 
            status : $status 
          }) {
            id createdAt status
          }
        }` , variables: {
        waitingRoomId: this.visit.waitingRoomId,
        medicalFileId: this.visit.medicalFile.id,
        symptoms: this.visit.symptoms.map(value => value.id),
        medicalActs: this.visit.medicalActs.map(value => value.id),
        vitalSetting: (this.isVitalSettingEdited()) ? (this.visit.vitalSetting) : (null),
        clinicalExam: (this.visit.clinicalExam && this.visit.clinicalExam.trim().length > 3) ? (this.visit.clinicalExam) : (null),
        condition: (this.visit.condition && this.visit.condition.name && this.visit.condition.name.trim().length > 0) ? ({
          name: this.visit.condition.name
        }) : (null),
        status: "in visit"
      }
    }).pipe(map(value => (<any>value.data).addVisit)).subscribe(async (data) => {
      this.visit.id = data.id;
      this.visit.status = data.status;
      this.visit.createdAt = data.createdAt;

      await this.submitVisitDrugDosages();
      await this.submitVisitCheckUps();
      await this.submitCertificats();
      await this.submitAppointment();

      this.isEdited = false;

      this.interactionService.showMessage.next(<Message>{
        message: `Visite de ${this.visit.medicalFile.name} ${this.visit.medicalFile.name} a commencé`,
        type: SUCCESS
      })

    })
  }

  public edit($event) {

    this.visit = $event;
    this.apollo.mutate({
      mutation: gql`
      mutation ($symptoms : [ID!] , $clinicalExam :String , $status : String, $medicalActs : [ID!]! , $vitalSetting : VitalSettingInput , $condition : ConditionInput)
      {
        editVisit(visitId : ${this.visit.id} , visit : {
          symptoms : $symptoms
          medicalActs : $medicalActs 
          status : $status 
          vitalSetting : $vitalSetting 
          clinicalExam : $clinicalExam
          condition : $condition
        })
      }
    `, variables: {
        symptoms: this.visit.symptoms.map(value => value.id),
        medicalActs: this.visit.medicalActs.map(value => value.id),
        vitalSetting: (this.isVitalSettingEdited()) ? (this.visit.vitalSetting) : (null),
        clinicalExam: (this.visit.clinicalExam && this.visit.clinicalExam.trim().length > 3) ? (this.visit.clinicalExam) : (null),
        condition: (this.visit.condition && this.visit.condition.name && this.visit.condition.name.trim().length > 0) ? ({
          name: this.visit.condition.name
        }) : (null),
        status: (!this.isEdit) ? ("in visit") : (this.visit.status)
      }
    }).subscribe(async (data) => {
      if (!this.isEdit)
        this.visit.status = "in visit";

      await this.submitVisitDrugDosages();
      await this.submitVisitCheckUps();
      await this.submitCertificats();
      await this.submitAppointment();

      this.isEdited = false;

      this.interactionService.showMessage.next(<Message>{
        message: `Visite de ${this.visit.medicalFile.name} ${this.visit.medicalFile.name} est enregistrée`,
        type: SUCCESS
      })

      if (!this.isEdit) {
        this.router.navigate([], {
          queryParams: {
            "pop-up-window": true,
            "window-page": "visit-details",
            "title": "détails de la visite",
            "visit-id": this.visit.id,
            "no-edit": true
          }
        })
      } else {
        this.closeEvent.emit();
      }
    })
  }

  private async submitVisitDrugDosages() {
    if (this.visit.visitDrugDosages.length > 0) {
      var data = await this.apollo.mutate({
        mutation: gql`
    mutation ADD_VISIT_DRUG_DOSAGES($visitId : ID! , $visitDrugDosages : [VisitDrugDosageInput!]! ){ 
      addVisitDrugDosages(visitId : $visitId , visitDrugDosages : $visitDrugDosages) { 
        drug {
          id 
          name
        } 
        dosage { 
          id name 
        }
        qsp  
        unitNumber 
      }
    }
  ` , variables: {
          visitId: this.visit.id,
          visitDrugDosages: this.visit.visitDrugDosages.map(function (value) {
            return {
              drug: {
                name: value.drug.name
              },
              dosage: {
                name: value.dosage.name
              },
              qsp: (value.qsp && value.qsp.trim().length > 0) ? (value.qsp) : (null),
              unitNumber: (value.unitNumber && value.unitNumber != 0) ? (value.unitNumber) : (1),
            }
          })
        }
      }).pipe(map(value => (<any>value.data).addVisitDrugDosages)).toPromise()
      this.visit.visitDrugDosages = data;
    }
  }



  private async submitVisitCheckUps() {
    if (this.visit.checkUps.length > 0 && this.visit.id) {
      var data = await this.apollo.mutate({
        mutation: gql`
          mutation ADD_VISIT_CHECKUPS($visitId : ID! , $checkUps : [ID!]!) { 
            addVisitCheckUps(visitId : $visitId, checkUps : $checkUps ) { 
              id
            }
          }` ,
        variables: {
          visitId: this.visit.id,
          checkUps: this.visit.checkUps.map(value => value.id)
        }
      }).pipe(map(value => (<any>value.data).addVisitCheckUps)).toPromise()
    }
  }



  private async submitCertificats() {
    if (this.visit.certificats.length > 0 && this.visit.id) {
      await this.apollo.mutate({
        mutation: gql`
          mutation ADD_VISIT_CERTIFICATS ($visitId:ID! , $certificats : [CertificatInput!]!) { 
            addVisitCertificats(visitId : $visitId , certificats : $certificats) { 
              id html 
            }
          }
        `, variables: {
          visitId: this.visit.id,
          certificats: this.visit.certificats.map(function (certificat) {
            return {
              html: certificat.html,
              certificatModelId: certificat.certificatModel.id
            }
          })
        }
      }).pipe(map(value => (<any>value.data).addVisitCertificats)).toPromise()
    }
  }


  private async submitAppointment() {
    if (this.visit.appointment && this.visit.id) {
      await this.apollo.mutate({
        mutation: gql`
          mutation ADD_APPOINTMENT($appointment : AppointmentInput){ 
            addAppointment(appointment : $appointment) { 
              id date time 
            }
          }
        ` , variables: {
          appointment: {
            visitId: this.visit.id,
            date: this.visit.appointment.date,
            time: (this.visit.appointment.time) ? (this.visit.appointment.time) : (null)
          }
        }
      }).pipe(map(value => (<any>value.data).addAppointment)).toPromise()
    }
  }

  private isVitalSettingEdited() {
    var keys = Object.keys(this.visit.vitalSetting);
    return keys.length > 0;
  }


  public ngOnDestroy() {
    
    if (this.isEdited) {
      this.router.navigate([], {
        queryParams: {
          "pop-up-window": true,
          "window-page": "yes-no-message",
          "title": "Sauvegarder la visite",
          "message": `la visite de ${this.visit.medicalFile.name} ${this.visit.medicalFile.lastname} a des modifications, vous voulez la sauvegarder ?`
        }
      });
      this.interactionService.yesOrNo.subscribe((response) => {
        if (response) {
          if (this.visit.id)
            this.edit(this.visit);
          else
            this.save(this.visit);
        }
      })
    }
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    })
  }
}
