import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Cabinet } from 'src/app/classes/Cabinet';
import { Doctor } from 'src/app/classes/Doctor';
import { Speciality } from 'src/app/classes/Speciality';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public doctor: Doctor;
  public cabinet: Cabinet;

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
      Validators.required,
      Validators.pattern(/^(00213|\+213|0)(5|6|7)[0-9]{8}$/)
    ]),
    specialityId: new FormControl("", [

    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(20)]),
    passwordConfirm: new FormControl("", [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(20),
    ]),
    cabinetPhone: new FormControl("", [
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
  }, { validators: this.ConfirmedValidator("password", "passwordConfirm") });


  public specialities: Speciality[] = [];
  public selectedSpeciality: Speciality = null;

  public password: any = {
    value: ""
  };

  public wilayas: any[] = [];
  public selectedWilaya: any = null;

  constructor(private apollo: Apollo , private router : Router) {
    this.doctor = new Doctor();
    this.cabinet = new Cabinet();
  }

  ngOnInit(): void {

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
    });

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
    })
  }
  public ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup): any => {

      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
  wilayaSelected() {
    // filter by if to find the selected wilaya 
    this.selectedWilaya = this.wilayas.find(wilaya => wilaya.id == this.form.value.wilayaId);
    this.cabinet.address.commune.id = this.selectedWilaya.communes[0].id;
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
    this.apollo.mutate({
      mutation: gql`
      
        mutation SIGN_UP($name :String! , $lastname : String!, $gender : Boolean! , $phone : String! , $email : String , $specialityId : ID , $password : String! , $confirmPassword : String!) { 
          SignUp ( doctor : { 
            name  : $name , 
            lastname : $lastname , 
            phone : $phone , 
            gender : $gender ,
            email : $email , 
            password : $password , 
            specialityId : $specialityId
            confirmPassword : $confirmPassword 
          }) { 
            doctor {
              id , name , lastname , email , phone , createdAt , updatedAt , isValid , lastFeedback , premiumRequest
              cabinet { 
                id 
              }
            } , token 
          }
        }` ,
      variables: {
        name: this.doctor.name,
        lastname: this.doctor.lastname,
        phone: this.doctor.phone,
        gender: this.doctor.gender,
        email: this.doctor.email,
        specialityId: (this.selectedSpeciality) ? (this.selectedSpeciality) : (null),
        password: this.password.value,
        confirmPassword: this.form.value.passwordConfirm
      }
    }).pipe(map(value => (<any>value.data).SignUp)).subscribe((data) => {
      var doctorAuth = data ; 
      localStorage.setItem("doctorAuth", JSON.stringify(doctorAuth));
      console.log(this.cabinet) ; 
      this.apollo.mutate({
      mutation : gql`
      
        mutation ADD_CABINET($header : String! , $headerAr : String , $phone : String! , $address : String , $communeId : ID!) {
          addCabinet(
            cabinet : {
              header : $header , 
              headerAr : $headerAr , 
              phone : $phone , 
              address : { address  : $address , communeId : $communeId }
            }
          ) {  
            id
            phone 
            email 
            header 
            headerAr 
            address {
              id address commune { id name wilaya { id name }}
            } 
          }
        }
      ` , variables : { 
        header : this.cabinet.header ,
        headerAr : this.cabinet.headerAr , 
        phone : this.cabinet.phone , 
        address : this.cabinet.address.address , 
        communeId : this.cabinet.address.commune.id
      }
      }).pipe(map(value => (<any>value.data).addCabinet)).subscribe((data) => { 
        doctorAuth.doctor.cabinet = data ; 
        console.log(doctorAuth)
        localStorage.setItem("doctorAuth", JSON.stringify(doctorAuth));
        this.router.navigate(["/dashboard/general"])    
      })
    })
  }
}
