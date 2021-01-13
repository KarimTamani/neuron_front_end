import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from 'rxjs/operators';
import { Cabinet } from 'src/app/classes/Cabinet';
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
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(64),
    ]),
    wilayaId: new FormControl(null, [
      Validators.required
    ]),
    communeId: new FormControl(null , [
      Validators.required
    ])
  });
  public wilayas: any[] = [];
  public selectedWilaya: any = null;
  public cabinet = null;
  public edit: boolean = false;

  constructor(private apollo: Apollo , private interactionService : InteractionService) {
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
    })
  }

  wilayaSelected() {
    // filter by if to find the selected wilaya 
    this.selectedWilaya = this.wilayas.find(wilaya => wilaya.id == this.form.value.wilayaId);
    this.cabinet.address.commune.id = null ;  
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
    // in case creating the office for the first time
    console.log(this.cabinet.services.map(value => parseInt(value.id) )) ; 
    if (!this.edit) {
      this.apollo.mutate({
        mutation: gql`
      mutation {
        addCabinet(
          cabinet : {
            name : "${this.form.value.name}" , 
            header : "${this.form.value.header}" , 
            headerAr : "${this.form.value.headerAr}" , 
            phone : "${this.form.value.phone}" , 
            email : "${this.form.value.email}" ,  
            address : { address  : "${this.form.value.address}" , communeId : ${this.form.value.communeId} }
            services : ${ this.cabinet.services.map(value => value.id ) }
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

      }`
      }).pipe(map(value => (<any>value.data).addCabinet)).subscribe((data) => {
        this.cabinet = data;
      })
    }else { 
      // in case we have an office and we want to edit it
      this.apollo.mutate({
        mutation : gql`
        mutation {
          editCabinet(
            cabinet : {
              name : "${this.form.value.name}" , 
              header : "${this.form.value.header}" , 
              headerAr : "${this.form.value.headerAr}" , 
              phone : "${this.form.value.phone}" , 
              email : "${this.form.value.email}" ,  
              address : { address  : "${this.form.value.address}" , communeId : ${this.form.value.communeId} }
              services : [${ this.cabinet.services.map(value => parseInt(value.id)) }]
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
        }
        `
      }).pipe(map(result => (<any>result.data).editCabinet)).subscribe((data) => { 
        
        this.cabinet = data ; 
      })
    }
  }
}
