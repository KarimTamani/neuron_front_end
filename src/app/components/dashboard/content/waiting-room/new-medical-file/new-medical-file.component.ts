import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { catchError, map } from 'rxjs/operators';
import { Profession } from 'src/app/classes/Profession';
import { Observable, of } from 'rxjs';
import { Address } from 'src/app/classes/Address';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';
import { ActivatedRoute } from '@angular/router';
import { FAIL, Message, SUCCESS } from 'src/app/classes/Message';
import { Commune } from 'src/app/classes/Commune';

@Component({
  selector: 'app-new-medical-file',
  templateUrl: './new-medical-file.component.html',
  styleUrls: ['./new-medical-file.component.css']
})
export class NewMedicalFileComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    lastname: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    email: new FormControl("", [
      Validators.email
    ]),
    phone: new FormControl("", [
      Validators.pattern(/^(00213|\+213|0)(5|6|7)[0-9]{8}$/)
    ]),
    birthday: new FormControl("", [
      Validators.required
    ]),
    address: new FormControl("", [
      Validators.minLength(4),
      Validators.maxLength(64),
    ]),
    wilayaId: new FormControl(null, [
    ]),
    communeId: new FormControl(null, [
    ])
  });

  public wilayas: any[] = [];
  public selectedWilaya: any = null;
  public professions: Profession[] = [];
  public showSubmitter: boolean = false;
  public edit: boolean = false;

  @Output() blackWindowEvent: EventEmitter<null>;
  @Input() medicalFile: MedicalFile;
  @Output() newMedicalFileEvent: EventEmitter<MedicalFile>;
  @Input() throwInteraction: boolean = false;
  @Output() closeEvent: EventEmitter<null>;

  constructor(
    private apollo: Apollo,
    private dataService: DataService,
    private interactionService: InteractionService,
    private virtualAssistantService: VirtualAssistantService,
    private route: ActivatedRoute) {

    this.blackWindowEvent = new EventEmitter<null>();
    this.newMedicalFileEvent = new EventEmitter<MedicalFile>();
    this.closeEvent = new EventEmitter<null>();
  }

  ngOnInit(): void {
    // handle va command to modifier the medical file 
    this.virtualAssistantService.onVACommand.subscribe((data) => {

      if (data.component == "MEDICAL-FILE-SUBMITTER") {
        if (data.name)
          this.medicalFile.name = data.name;

        if (data.lastname)
          this.medicalFile.lastname = data.lastname;
        if (data.birthday) {
          var date = this.dataService.frToYMDDate(data.birthday);
          if (date) {
            this.medicalFile.birthday = date;
          }
        }

        if (data.phone) {
          this.medicalFile.phone = data.phone.split(" ").join("");
        }

        if (data.email) {
          this.medicalFile.email = data.email;
        }
        if (data.address) {
          this.medicalFile.address.address = data.address;
        }
        if (data.wilaya) {
          var wilaya = this.wilayas.find(value => value.name.toLowerCase() == data.wilaya);
          if (wilaya) {

            this.selectedWilaya = wilaya;
            this.medicalFile.address.commune.wilaya.id = this.selectedWilaya.id
          }
        }
        if (data.profession) {
          this.medicalFile.profession.name = data.profession;
        }
      }
    });

    var params = this.route.snapshot.queryParams;
    if (params["medical-file"]) {
      this.medicalFile = JSON.parse(decodeURIComponent(params["medical-file"]));
    }


    // get all the wilayas 
    this.apollo.query({
      query: gql`
      {
        getAllWilayas {
          id
          name
          communes {
            id 
            name
            postalCode
          }
        }
      }`
    }).pipe(map(value => (<any>value.data).getAllWilayas)).subscribe((data) => {
      this.wilayas = data;


      if (this.medicalFile == null)
        this.medicalFile = new MedicalFile();
      else {
        this.apollo.query({
          query: gql`
        {
          getMedicalFile(medicalFileId : ${this.medicalFile.id}) {
              id
              name
              lastname
              gender
              phone
              email
              birthday
              address {
                  id
                  address
                  commune {
                      id
                      postalCode
                      name
                      wilaya {
                          id
                          name
                      }
                  }
              }
              profession {
                id name
              }
              antecedents {
                id name type
              }  
          }
        
        }
        `
        }).pipe(map(value => (<any>value.data).getMedicalFile)).subscribe((data) => {

          if (data.address == null)
            data.address = new Address();

          else if (data.address.commune == null)
            data.address.commune = new Commune();


          this.medicalFile = data;

          if (this.medicalFile.profession == null)
            this.medicalFile.profession = new Profession();
          if (!this.medicalFile.antecedents)
            this.medicalFile.antecedents = [];
          if (this.medicalFile.address && this.medicalFile.address.commune) {

            this.selectedWilaya = this.wilayas.find(value => value.id == this.medicalFile.address.commune.wilaya.id);

          }


          this.edit = true;
        })
      }
    })
    this.apollo.query({
      query: gql`
        {
          getAllProfessions{
            id name
          }
        }`
    }).pipe(map(value => (<any>value.data).getAllProfessions)).subscribe((data) => {
      this.professions = data;
    })
  }

  public professionSearchFunction: any = (query: string) => {
    return new Observable((observer) => {
      observer.next(this.professions.filter(value => value.name.toLowerCase().includes(query.toLowerCase())));
    })
  }

  wilayaSelected() {
    // filter by if to find the selected wilaya 
    this.selectedWilaya = this.wilayas.find(wilaya => wilaya.id == this.form.value.wilayaId);
    this.medicalFile.address.commune.id = this.selectedWilaya.communes[0].id;
  }


  public save() {

    if (this.showSubmitter)
      return;
    if (this.medicalFile.profession.name && this.medicalFile.profession.name.trim().length > 0)
      this.apollo.mutate({
        mutation: gql`
        mutation {
          addProfession(profession : {
            name  : "${this.medicalFile.profession.name}"
          }) {
            id name
          }
        }`
      }).pipe(map(value => (<any>value.data).addProfession)).subscribe((data) => {
        this.medicalFile.profession = data;
        if (!this.edit)
          this.addMedicalFile();
        else
          this.editMedicalFile();
      })
    else {
      if (!this.edit)
        this.addMedicalFile();
      else
        this.editMedicalFile();
    }
  }


  private addMedicalFile() {

    var variables = <any>{
      name: this.medicalFile.name,
      lastname: this.medicalFile.lastname,
      birthday: this.medicalFile.birthday,
      gender: this.medicalFile.gender,
      phone: this.medicalFile.phone,
      email: this.medicalFile.email,
      professionId: this.medicalFile.profession.id,
      antecedents: this.medicalFile.antecedents.map(value => value.id)
    }

    if (this.medicalFile.address.commune.id && this.medicalFile.address.address && this.medicalFile.address.address.trim().length > 0) {

      variables.address = {
        address: this.medicalFile.address.address,
        communeId: this.medicalFile.address.commune.id
      };
    }
    else if (this.medicalFile.address.commune.id)
      variables.address = {
        address: null,
        communeId: this.medicalFile.address.commune.id
      };

    else if (this.medicalFile.address.address && this.medicalFile.address.address.trim().length > 0) {
      variables.address = {
        address: this.medicalFile.address.address,
        communeId: null
      };
    }

    this.apollo.mutate({
      mutation: gql`
          mutation ADD_MEDICAL_FILE(
            $name : String!, 
            $lastname : String!
            $birthday : String! 
            $phone : String 
            $email : String
            $address : AddressInput , 
            $professionId : ID , 
            $gender : Boolean! 
            $antecedents : [ID!]!
          ){
            addMedicalFile(
              medicalFile: {
                  name: $name
                  lastname: $lastname
                  birthday: $birthday
                  gender : $gender
                  phone: $phone
                  email: $email
                  address: $address 
                  professionId : $professionId , 
                  antecedents : $antecedents
              }
            ) {
              id
              name
              lastname
              gender
              phone
              email
              birthday
              address {
                  id
                  address
                  commune {
                      id
                      postalCode
                      name
                      wilaya {
                          id
                          name
                      }
                  }
              }
              profession {
                id name
              }
              antecedents {
                id name type
              } 
            }
          } ` ,
      variables: variables
    }).pipe(
      map(value => (<any>value.data).addMedicalFile),
      catchError(error => {
        if (error.graphQLErrors) {
          this.interactionService.showMessage.next(<Message>{
            message: error.message.replace('GraphQL error:', '').trim(),
            type: FAIL
          })
        }
        return of(null);
      })
    ).subscribe((data) => {

      // check if the data exists that mean there is no error has been trigred
      if (data == null)
        return;

      this.medicalFile = data;
      if (!this.throwInteraction)
        this.newMedicalFileEvent.emit(this.medicalFile)
      else
        this.interactionService.newMedicalFile.next(data);

      this.interactionService.showMessage.next(<Message>{
        message: `Dossier médical de ${this.medicalFile.name} ${this.medicalFile.lastname} a été créé`,
        type: SUCCESS
      }) ; 
      this.closeEvent.emit()
    })
  }

  public editMedicalFile() {
    var variables = <any>{
      name: this.medicalFile.name,
      lastname: this.medicalFile.lastname,
      birthday: this.medicalFile.birthday,
      gender: this.medicalFile.gender,
      phone: this.medicalFile.phone,
      email: this.medicalFile.email,
      professionId: this.medicalFile.profession.id,
      antecedents: this.medicalFile.antecedents.map(value => value.id)
    }




    if (this.medicalFile.address.commune.id && this.medicalFile.address.address && this.medicalFile.address.address.trim().length > 0) {

      variables.address = {
        address: this.medicalFile.address.address,
        communeId: this.medicalFile.address.commune.id
      };
    }
    else if (this.medicalFile.address.commune.id)
      variables.address = {
        address: null,
        communeId: this.medicalFile.address.commune.id
      };

    else if (this.medicalFile.address.address && this.medicalFile.address.address.trim().length > 0) {
      variables.address = {
        address: this.medicalFile.address.address,
        communeId: null
      };
    }


    this.apollo.mutate({
      mutation: gql`
      mutation EDIT_MEDICAL_FILE(
        $name : String!, 
        $lastname : String!
        $birthday : String! 
        $phone : String 
        $email : String
        $address : AddressInput , 
        $professionId : ID , 
        $gender : Boolean! 
        $antecedents : [ID!]!
      ){
        editMedicalFile(
          medicalFileId : ${this.medicalFile.id} , 
          medicalFile: {
              name: $name
              lastname: $lastname
              birthday: $birthday
              gender : $gender
              phone: $phone
              email: $email
              address: $address 
              professionId : $professionId , 
              antecedents : $antecedents
          }
        ) 
      }` ,
      variables: variables
    }).pipe(map(value => (<any>value.data).editMedicalFile)).subscribe((data) => {
      this.interactionService.medicalFileEdited.next(this.medicalFile);
      
      this.interactionService.showMessage.next(<Message>{
        message: `Dossier médical de ${this.medicalFile.name} ${this.medicalFile.lastname} a édité`,
        type: SUCCESS
      }) ; 
      this.closeEvent.emit();
    })
  }

  public formSubmitted($event) {
    if ($event.key != "Enter")
      return true;
    else {
      if (!this.showSubmitter && this.form.valid) {
        this.save();
      }
      return false;
    }
  }

  public clear() {
    this.medicalFile = new MedicalFile();
    this.selectedWilaya = null;
  }
}
