import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Profession } from 'src/app/classes/Profession';
import { Observable } from 'rxjs';

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

  @Input() medicalFile: MedicalFile;
  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    if (this.medicalFile == null)
      this.medicalFile = new MedicalFile();
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
    this.medicalFile.address.commune.id = null;
  }


  public save() {
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
        this.addMedicalFile();
      })
    else
      this.addMedicalFile();
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

    if (this.medicalFile.address.commune.id)
      variables.address = {
        address: this.medicalFile.address,
        communeId: this.medicalFile.address.commune.id
      };

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
    }).pipe(map(value => (<any>value.data).addMedicalFile)).subscribe((data) => {
      console.log(data);
    })
  }
}
