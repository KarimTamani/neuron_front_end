import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Condition } from 'src/app/classes/Condition';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-visit-loader',
  templateUrl: './visit-loader.component.html',
  styleUrls: ['./visit-loader.component.css']
})
export class VisitLoaderComponent implements OnInit {
  @Input() visit: Visit;
  @Output() visitSelectedEvent: EventEmitter<Visit>;
  public showSearch: boolean = false;
  public submittedMedicalFile: MedicalFile;
  public waitingRoom: WaitingRoom;
  constructor(private apollo: Apollo, private dataService: DataService) {
    this.submittedMedicalFile = new MedicalFile();
    this.visitSelectedEvent = new EventEmitter<Visit>();
  }
  ngOnInit(): void {
    if (this.visit.medicalFile == null)
      this.showSearch = true;
    // get the current time and get the current WaitingRoom 
    this.apollo.query({
      query: gql`
          { 
            getCurrentDate
          }`
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => {
      this.apollo.query({
        query: gql`
          { 
            getWaitingRoom(waitingRoom : {date : "${this.dataService.castDateYMD(data)}"}) { 
              id date visits {
                id 
              }
            }
          }`
      }).pipe(map(value => (<any>value.data).getWaitingRoom)).subscribe((data) => {
        if (data == null) {
          this.apollo.mutate({
            mutation: gql`
              mutation {
                addWaitingRoom(waitingRoom : {}) {
                  id date visits {
                    id
                  }
                }
              } 
            `
          }).pipe(map(value => (<any>value.data).addWaitingRoom)).subscribe((data) => {
            this.waitingRoom = data;
            this.waitingRoom.visits = [];
            console.log("waiting room created");
          })
        } else
          this.waitingRoom = data;

      })
    })

  }

  selectMedicalFile($event) {
    this.showSearch = false;
    this.visit.medicalFile = $event;
    this.submittedMedicalFile = new MedicalFile();
    this.apollo.query({
      query: gql`
        {
          checkIfVisitInWaitingRoom(medicalFileId : ${this.visit.medicalFile.id}) { 
            id
          waitingRoom {
            id
            date
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
          appointment { 
            id date time 
          }

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
          checkUps {
            id name
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
    }).pipe(map(value => (<any>value.data).checkIfVisitInWaitingRoom)).subscribe((data) => {

      if (data) {
        this.visit = data;
        if (this.visit.condition == null)
          this.visit.condition = new Condition();
      }
      else {
        this.visit.waitingRoom = this.waitingRoom;
        this.visit.waitingRoomId = this.waitingRoom.id;
        this.visit.order = this.visit.waitingRoom.visits.length + 1
      }
      this.visitSelectedEvent.emit(this.visit);

    })
  }
  public closeMedicalFile() {
    this.visit = new Visit();
    this.showSearch = true;
    this.visit.medicalFile = null;
    this.visitSelectedEvent.emit(this.visit);
  }
  public searchCondtion: any = (query) => {
    // search for conditions and diseases 
    return this.apollo.query({
      query: gql`
        { 
          searchConditions(name : "${query}") { 
            id name
          }
        }
      `
    }).pipe(map(value => (<any>value.data).searchConditions));
  }

  public searchFunction: any = (query) => {

    // define the search medical files function
    return this.apollo.query({
      query: gql`
          {
            searchMedicalFiles(searchQuery : "${query}") {
              rows { 
                id 
                name 
                lastname 
                phone 
                email 
                birthday 
                gender
                antecedents {
                  id name
                }
              }
            }
          }`
    }).pipe(map(result => (<any>result.data).searchMedicalFiles.rows));
  }

  public saveVsit() {

    if (this.visit.id) {
      this.apollo.mutate({
        mutation: gql`
        mutation ($symptoms : [ID!] , $clinicalExam :String , $medicalActs : [ID!]! , $vitalSetting : VitalSettingInput , $condition : ConditionInput)
        {
          editVisit(visitId : ${this.visit.id} , visit : {
            symptoms : $symptoms
            medicalActs : $medicalActs 
            status : "in visit" 
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
          }) : (null)
        }
      }).subscribe((data) => {
        this.submitVisitDrugDosages();
        this.submitVisitCheckUps();
        this.submitCertificats();
        this.submitAppointment();

      })
    } else {
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
              id 
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
      }).pipe(map(value => (<any>value.data).addVisit)).subscribe((data) => {
        this.visit.id = data.id;
        this.submitVisitDrugDosages();
        this.submitVisitCheckUps();
        this.submitCertificats();
        this.submitAppointment();

      })
    }


  }


  private submitVisitDrugDosages() {
    if (this.visit.visitDrugDosages.length > 0) {
      this.apollo.mutate({
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
      }).pipe(map(value => (<any>value.data).addVisitDrugDosages)).subscribe((data) => {
        this.visit.visitDrugDosages = data;
      })
    }
  }



  private submitVisitCheckUps() {
    if (this.visit.checkUps.length > 0 && this.visit.id) {
      this.apollo.mutate({
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
      }).pipe(map(value => (<any>value.data).addVisitCheckUps)).subscribe(() => {

      })
    }
  }



  private submitCertificats() {
    if (this.visit.certificats.length > 0 && this.visit.id) {
      this.apollo.mutate({
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
      }).pipe(map(value => (<any>value.data).addVisitCertificats)).subscribe((data) => {

      })
    }
  }


  private submitAppointment() {
    if (this.visit.appointment && this.visit.id) {
      this.apollo.mutate({
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
            time: this.visit.appointment.time
          }
        }
      }).pipe(map(value => (<any>value.data).addAppointment)).subscribe((data) => {

      })
    }
  }
  private isVitalSettingEdited() {
    var keys = Object.keys(this.visit.vitalSetting);
    return keys.length > 0;
  }

}
