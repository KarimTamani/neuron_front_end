import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-general-information',
  templateUrl: './general-information.component.html',
  styleUrls: ['./general-information.component.css']
})
export class GeneralInformationComponent implements OnInit {
  public doctor: any = {};
  public specialities: any[] = [];
  public selectedSpeciality = null;
  // form validation for doctor signup 
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
      Validators.required,
      Validators.email
    ]),
    phone: new FormControl("", [
      Validators.required,
      Validators.pattern(/^(00213|\+213|0)(5|6|7)[0-9]{8}$/)
    ]),
    graduation: new FormControl("", [
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    orderNumber: new FormControl("", [
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    specialityId: new FormControl("", [

    ])
  });

  constructor(private apollo: Apollo) { }
  ngOnInit(): void {
    // get the doctor profil from the apollo server
    this.apollo.query<any>({
      query: gql`
      { 
        getDoctorProfil {
          id
          name
          lastname 
          lastFeedback 
          premiumRequest 
          phone
          email 
          graduation 
          gender
          orderNumber 
          speciality { id name }
        }
      }`
    }).pipe(map(value => value.data.getDoctorProfil)).subscribe((data) => {
      this.doctor = data;
      if (this.doctor.speciality)
        this.selectedSpeciality = this.doctor.speciality.id
  
    });
    // get all the specialities that we have 
    this.apollo.query({
      query: gql`
      { 
        getAllSpecialities{
          id name
        }
      }
      `
    }).pipe(map(value => (<any>value.data).getAllSpecialities)).subscribe((data) => {
      this.specialities = data;

    })
  }
  submit() {
    this.apollo.mutate({
      mutation: gql`
      mutation {
        editDoctor(doctorInput : {
          name : "${this.form.value.name}" , 
          lastname : "${this.form.value.lastname}" , 
          email : "${this.form.value.email}" , 
          phone : "${this.form.value.phone}" , 
          gender : ${this.doctor.gender}
          graduation : "${this.form.value.graduation}" , 
          orderNumber : "${this.form.value.orderNumber}" 
          specialityId : ${this.form.value.specialityId}
        })  {
          token , 
          doctor {
            id
            name
            lastname 
            lastFeedback 
            premiumRequest 
            phone
            email 
            graduation 
            gender
            orderNumber 
            speciality { id name }
          }
        }
      }
      `
    }).pipe(map(value => (<any>value.data).editDoctor)).subscribe((data) => {
      console.log(data)
      localStorage.setItem("doctorAuth", JSON.stringify(data))
    })
  }
}
