import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Condition } from 'src/app/classes/Condition';
import { WaitingRoom } from 'src/app/classes/WaitingRoom';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-loader',
  templateUrl: './visit-loader.component.html',
  styleUrls: ['./visit-loader.component.css']
})
export class VisitLoaderComponent implements OnInit {
  @Input() visit: Visit;
  @Output() visitSelectedEvent: EventEmitter<Visit>;



  @Output() editVisitEvent : EventEmitter<Visit> ; 
  @Output() saveVisitEvent : EventEmitter<Visit> ; 

  public showSearch: boolean = false;
  public submittedMedicalFile: MedicalFile;
  public waitingRoom: WaitingRoom;
  constructor(
    private apollo: Apollo, 
    private dataService: DataService , 
    private router : Router , 
    private interactionService : InteractionService) {

    this.submittedMedicalFile = new MedicalFile();
    this.visitSelectedEvent = new EventEmitter<Visit>();

    this.editVisitEvent = new EventEmitter<Visit>() ; 
    this.saveVisitEvent = new EventEmitter<Visit>() ; 

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



  public change($event) { 
    if ($event.name && $event.name.trim().length > 0) { 
      this.interactionService.visitEdited.next() ; 
    }
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
      this.editVisitEvent.emit(this.visit) ; 
    }else { 
      this.saveVisitEvent.emit(this.visit) ;  
    } 
  }
 

  public openMedicalFileSubmitter() { 
    this.router.navigate([] , { 
      queryParams : { 
        "title" : "Ajouter un nouveau Dossie Medical" , 
        "window-page" : "medical-file-submitter" , 
        "pop-up-window" : true , 
      }
    }); 
    const subscription = this.interactionService.newMedicalFile.subscribe((data) => { 
      this.visit.medicalFile = data ; 
      this.submittedMedicalFile = this.visit.medicalFile ; 
      
      this.visit.waitingRoom = this.waitingRoom;
      this.visit.waitingRoomId = this.waitingRoom.id;
      this.visit.order = this.visit.waitingRoom.visits.length + 1 ;       

      subscription.unsubscribe() ; 
    })
  }

}
