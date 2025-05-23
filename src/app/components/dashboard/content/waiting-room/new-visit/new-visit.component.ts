import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MedicalAct } from 'src/app/classes/MedicalAct';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Visit } from 'src/app/classes/Visit';
import { Symptom } from 'src/app/classes/Symptom';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { ActivatedRoute } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { VitalSetting } from 'src/app/classes/VitalSetting';
import { SUCCESS , Message, FAIL} from 'src/app/classes/Message';
import { WaitingRoom } from 'src/app/classes/WaitingRoom'; 
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-new-visit',
  templateUrl: './new-visit.component.html',
  styleUrls: ['./new-visit.component.css']
})
export class NewVisitComponent implements OnInit {
  @Output() closeEvent: EventEmitter<null>;

  public medicalActs: MedicalAct[] = [];
  public visit: Visit;
  public selectedMedicalActs: MedicalAct[] = [];
  public totalPrice: number = 0;
  public submittedSymptom: Symptom;
  public submittedMedicalFile: MedicalFile;
  public symptoms: Symptom[] = [];
  public showNewMedicalFile: boolean = false;
  public showVitalSetting: boolean = false;
  public edit: boolean = false;
  public blackWindow: boolean = false;
  public medicalFileUnControl: boolean;
  public medicalFileInvalid : boolean = false ; 
  public waitingRoom : WaitingRoom ; 

  public whiteBackground : boolean = false ; 
  constructor(
    private apollo: Apollo, 
    private route: ActivatedRoute, 
    private interactionservice: InteractionService , 
    private dataService : DataService) {

    this.closeEvent = new EventEmitter<null>();
    this.visit = new Visit();
    this.submittedSymptom = new Symptom();
    this.submittedMedicalFile = new MedicalFile();
  }

  ngOnInit(): void {
    // get the medical acts to calculate the price of the visit
    this.apollo.query({
      query: gql`
        { 
          getAllMedicalActs {
            id name price
          } 
        } `
    }).pipe(map(value => (<any>value.data).getAllMedicalActs)).subscribe((data) => {
      this.medicalActs = data;
    })



    var params = this.route.snapshot.queryParams;
    
    if (params["waiting-room"]) 
      this.waitingRoom = JSON.parse(decodeURIComponent(params["waiting-room"])) ; 
    
    
    
    if (params["medical-file-uncontrol"])
      this.medicalFileUnControl = JSON.parse(params["medical-file-uncontrol"]);


    if (params["visit"]) {
      // if the visit is defined for the edit mode
      // load medical act into selected medical acts 
      // load symptoms into symptoms
      // calculate the total price for the visit  
      this.visit = JSON.parse(decodeURIComponent(params["visit"]));

      this.selectedMedicalActs = this.visit.medicalActs;
      this.symptoms = this.visit.symptoms;
      this.totalPrice = 0;
      this.selectedMedicalActs.forEach((act) => {
        this.totalPrice += act.price;
      })
      if (this.visit.id) {
        this.edit = true;
        this.medicalFileUnControl = true ; 
      }
    }
    if (params["waiting-room"]) {
      // get the waiting room from the params 
      // if not in edit mode calculate the order of the visit
      this.visit.waitingRoom = JSON.parse(decodeURIComponent(params["waiting-room"]));

      if (this.edit == false)
        this.visit.order = this.visit.waitingRoom.visits.length + 1;
    }

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
              }
            }
          }`
    }).pipe(map(result => (<any>result.data).searchMedicalFiles.rows));
  }

  public symptomsSearchFunction: any = (query) => {
    // search for symptoms by name
    return this.apollo.query({
      query: gql`
        {
          searchSymptom(symptom : "${query}") { 
            id name 
          }
        }`
    }).pipe(map(value => (<any>value.data).searchSymptom));
  }

  public isMedicalActSelected(medicalAct) {
    let index = this.selectedMedicalActs.findIndex(value => value.id == medicalAct.id);
    return index >= 0;
  }

  public selectMedicalAct(medicalAct) {
    // if the medical act is allready selected remove it 
    // else push it 
    let index = this.selectedMedicalActs.findIndex(value => value.id == medicalAct.id);
    if (index >= 0) {
      this.selectedMedicalActs.splice(index, 1);
    } else
      this.selectedMedicalActs.push(medicalAct);
    // calculate the total price of the visit 
    this.totalPrice = 0;
    this.selectedMedicalActs.forEach((act) => {
      this.totalPrice += act.price;
    })
  }

  symptomSelected($event) {
    this.apollo.mutate({
      mutation: gql`
        mutation { 
          addSymptom(symptom : { 
            name : "${$event.name}"
          }) {
            id name 
          }
        }
      `
    }).pipe(map((response) => (<any>response.data).addSymptom)).subscribe((data) => {
      this.symptoms.splice(0, 0, data);
    })
  }
  removeSymptom(symptom) {
    const index = this.symptoms.findIndex((value) => value.id == symptom.id);
    this.symptoms.splice(index, 1);
  }
  selectMedicalFile($event) {

    this.visit.medicalFile = $event;
    this.submittedMedicalFile = new MedicalFile();
   
    const index = this.waitingRoom.visits.findIndex(value => value.medicalFile.id == this.visit.medicalFile.id && (value.status == "waiting" || value.status == "in visit")  ) ; 
    
    if (index >= 0 )  { 
      this.medicalFileInvalid = true ; 
      this.interactionservice.showMessage.next(<Message> { 
        message : `désolé ce patient ${this.visit.medicalFile.name} ${this.visit.medicalFile.lastname} existe déjà dans la salle d'attente` , 
        type : FAIL , 
      })
    }
  }

  public saveVisit() {
    
    
    
    if (this.medicalFileInvalid) { 
      this.interactionservice.showMessage.next(<Message> { 
        message : `désolé ce patient ${this.visit.medicalFile.name} ${this.visit.medicalFile.lastname} existe déjà dans la salle d'attente` , 
        type : FAIL , 
      })
      return ; 
    }
    
    this.apollo.mutate({
      mutation: gql`
        mutation ($symptoms : [ID!] , $medicalActs : [ID!]! , $vitalSetting : VitalSettingInput){
          addVisit (visit : {
            waitingRoomId : "${this.visit.waitingRoom.id}" 
            medicalFileId : "${this.visit.medicalFile.id}"
            symptoms : $symptoms 
            medicalActs : $medicalActs 
            vitalSetting : $vitalSetting
          }) {id }
        }
      ` ,
      variables: {
        symptoms: this.symptoms.map(value => value.id),
        medicalActs: this.selectedMedicalActs.map(value => value.id),
        vitalSetting: (this.isVitalSettingEdited()) ? (<VitalSetting>this.visit.vitalSetting) : (null)
      }
    }).pipe(map(value => (<any>value.data).addVisit)).subscribe((data) => {
      this.closeEvent.emit();
      this.interactionservice.newVisitAdded.next();
      this.interactionservice.showMessage.next({
        message: `le patient ${this.visit.medicalFile.lastname} ${this.visit.medicalFile.name} est present dans la salle d'attente`,
        type: SUCCESS
      })
    })
  }

  public editVisit() {
    if (this.medicalFileInvalid) { 
      this.interactionservice.showMessage.next(<Message> { 
        message : `désolé ce patient ${this.visit.medicalFile.name} ${this.visit.medicalFile.lastname} existe déjà dans la salle d'attente` , 
        type : FAIL , 
      })
      return ; 
    }

    delete (<any>this.visit.vitalSetting).__typename;
    this.apollo.mutate({
      mutation: gql`
        mutation ($symptoms : [ID!] , $medicalActs : [ID!]! , $vitalSetting : VitalSettingInput){
          editVisit (visitId : ${this.visit.id} , visit : {
            symptoms : $symptoms 
            medicalActs : $medicalActs
            vitalSetting : $vitalSetting
          }) 
        }
      ` ,
      variables: {
        symptoms: this.symptoms.map(value => value.id),
        medicalActs: this.selectedMedicalActs.map(value => value.id),
        vitalSetting: (this.isVitalSettingEdited()) ? (<VitalSetting>this.visit.vitalSetting) : (null)
      }
    }).pipe(map(value => (<any>value.data).addVisit)).subscribe((data) => {
      this.closeEvent.emit();
      this.interactionservice.newVisitAdded.next();
    })
  }

  public newMedicalFile($event) {
    this.visit.medicalFile = $event;
    this.showNewMedicalFile = false;
    this.whiteBackground = false ; 
  }


  private isVitalSettingEdited() {
    var keys = Object.keys(this.visit.vitalSetting);
    return keys.length > 0;
  }

  public closeMedicalFile() {
    this.visit.medicalFile = null;
    this.medicalFileInvalid = false ; 
  }
  public editMedicalFile() {
    this.showNewMedicalFile = true;
    this.whiteBackground = true ; 
  }

 

  public frDate(date : string) { 
    return this.dataService.castFRDate(new Date (date))  ;
  }

}

