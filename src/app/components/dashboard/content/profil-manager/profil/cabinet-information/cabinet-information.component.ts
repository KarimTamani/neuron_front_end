import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from 'rxjs/operators';
import { Cabinet } from 'src/app/classes/Cabinet';

import { SUCCESS } from 'src/app/classes/Message';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-cabinet-information',
  templateUrl: './cabinet-information.component.html',
  styleUrls: ['./cabinet-information.component.css']
})
export class CabinetInformationComponent implements OnInit {
  public form: FormGroup = new FormGroup({
    header: new FormControl("", [
      Validators.required,
      Validators.maxLength(255),
      Validators.minLength(6)
    ]),
    headerAr: new FormControl("", [
      Validators.maxLength(255),
      Validators.minLength(6)
    ]),
    name: new FormControl("", [
      Validators.maxLength(60),
      Validators.minLength(3)
    ]),
    email: new FormControl("", [
      Validators.email,
    ]),
    phone: new FormControl("", [
      Validators.required,
      this.phoneValidator
    ]),
    address: new FormControl("", [

      Validators.minLength(4),
      Validators.maxLength(64),
    ]),
    wilayaId: new FormControl(null, [
      Validators.required
    ]),
    communeId: new FormControl(null, [
      Validators.required
    ])
  });
  public wilayas: any[] = [];
  public selectedWilaya: any = null;
  public cabinet = null;
  public edit: boolean = false;
  public isEdited: boolean = false;

  constructor(
    private apollo: Apollo,
    private interactionService: InteractionService,
    private router: Router) {
  }

  ngOnInit(): void {
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
      }
      `
    }).pipe(map(value => (<any>value.data).getAllWilayas)).subscribe((data) => {
      this.wilayas = data;
      // after getting all the wilayas get the doctor office 
      this.apollo.query({
        query: gql`
        {
          getCabinet {
            id
            name
            phone 
            email 
            header 
            headerAr 
            address {
              id address commune { id name wilaya { id name }}
            }
            services {
              id name language
            }
          }
        }
        
        `
      }).pipe(map(value => (<any>value.data).getCabinet)).subscribe((data) => {
        this.cabinet = data;
        // check if the doctor has a office and check if the address exists
        if (this.cabinet) {
          if (this.cabinet.address)
            this.selectedWilaya = this.wilayas.find(wilaya => wilaya.id == this.cabinet.address.commune.wilaya.id)
          this.edit = true;
        } else
          this.cabinet = new Cabinet();
      })
    })

    this.interactionService.updateService.subscribe((services) => {
      this.cabinet.services = services;
      this.isEdited = true;
    })
  }

  wilayaSelected() {
    // filter by if to find the selected wilaya 
    this.selectedWilaya = this.wilayas.find(wilaya => wilaya.id == this.form.value.wilayaId);

    this.cabinet.address.commune.id = this.selectedWilaya.communes[0].id;
    this.isEdited = true;
  }

  private phoneValidator(formControl: FormControl): any {
    let phone = formControl.value;
    // validate the phone to algerian phone and fix 
    if (phone && !phone.match(/^(00213|\+213|0)(5|6|7)[0-9]{8}$/) && !phone.match(/^(00213|\+213|0)(3)[0-9]{7}$/))
      return {
        pattern: {
          phone: phone
        }
      };
    return null;
  }
  public submit() {

    // ${}
    // in case creating the office for the first time
    if (!this.edit) {
      this.apollo.mutate({
        mutation: gql`
      mutation ADD_CABINET($name : String , $header : String! , $headerAr : String , $phone : String! , $email : String , $address : String , $communeId : ID!, $services : [ID!]){
        addCabinet(
          cabinet : {
            name : $name , 
            header : $header , 
            headerAr : $headerAr , 
            phone : $phone , 
            email : $email ,  
            address : { address  : $address , communeId : $communeId }
            services : $services
          }
        ) {  id
          name
          phone 
          email 
          header 
          headerAr 
          address {
            id address commune { id name wilaya { id name }}
          } 
          services {
            id name language
          }
        }
      }` , 
      variables : { 
        name : this.form.value.name , 
        header : this.form.value.header , 
        headerAr : this.form.value.headerAr , 
        phone : this.form.value.phone , 
        email : this.form.value.email , 
        address : this.form.value.address , 
        communeId : this.form.value.communeId , 
        services : this.cabinet.services.map(value => value.id) 
      }
      }).pipe(map(value => (<any>value.data).addCabinet)).subscribe((data) => {
        this.cabinet = data;

        var doctorAuth = JSON.parse(localStorage.getItem("doctorAuth")) ; 
        if (doctorAuth) { 
          doctorAuth.doctor.cabinet = this.cabinet ; 
          localStorage.setItem("doctorAuth" , JSON.stringify(doctorAuth)) ; 
        }

        this.interactionService.cabinetCreated.next(this.cabinet);

        this.interactionService.showMessage.next({
          message : "Votre Cabinet Médical est créée" , 
          type : SUCCESS
        }) ; 


      })
    } else {
      // in case we have an office and we want to edit it
      this.apollo.mutate({
        mutation: gql`
        mutation EDIT_CABINET($name : String , $header : String! , $headerAr : String , $phone : String! , $email : String , $address : String , $communeId : ID!, $services : [ID!]){
          editCabinet(
            cabinet : {
              name : $name , 
              header : $header , 
              headerAr : $headerAr , 
              phone : $phone , 
              email : $email ,  
              address : { address  : $address , communeId : $communeId }
              services : $services
            }
          ) {  id
            name
            phone 
            email 
            header 
            headerAr 
            address {
              id address commune { id name wilaya { id name }}
            } 
            services {
              id name language
            }
          }
        }` ,
        variables : { 
          name : this.form.value.name , 
          header : this.form.value.header , 
          headerAr : this.form.value.headerAr , 
          phone : this.form.value.phone , 
          email : this.form.value.email , 
          address : this.form.value.address , 
          communeId : this.form.value.communeId , 
          services : this.cabinet.services.map(value => value.id)       
        }
      }).pipe(map(result => (<any>result.data).editCabinet)).subscribe((data) => {

        this.interactionService.showMessage.next({
          message : "Votre Cabinet Médical est édité" , 
          type : SUCCESS
        }) ; 
        this.cabinet = data;
      })
    }

  }

  public setChanged() {
    this.isEdited = true;

  }
}
