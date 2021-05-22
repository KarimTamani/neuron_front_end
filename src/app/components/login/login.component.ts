import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // for group for validation of input fields 
  public form: FormGroup = new FormGroup({
    email: new FormControl("", [
      Validators.required, Validators.email
    ]),
    password: new FormControl("", [
      Validators.required, Validators.maxLength(20), Validators.minLength(7)
    ])
  })
  public loaded: boolean = false;
  constructor(private apollo: Apollo, private router: Router) { }

  ngOnInit(): void {
    let doctorAuth = JSON.parse(localStorage.getItem("doctorAuth"));
    if (doctorAuth && doctorAuth.doctor.isValid)
      this.router.navigate(["dashboard/general"]);
    else
      this.loaded = true; 
  }
  login() {
    // login send the email and the password to the apollo server 
    // wait for the response if the response is success save the auth response to the localstorage 
    // else show error message
    this.apollo.mutate({
      mutation: gql`
        mutation {
          Login(doctor : {
            identifier : "${this.form.value.email}" , 
            password : "${this.form.value.password}"
          }) {
            doctor {
              id , name , lastname , email , phone , createdAt , updatedAt , isValid , lastFeedback , premiumRequest
              cabinet { 
                id 
              }
            } , token 
          }
        }
      `
    }).pipe(map(result => (<any>result.data).Login)).subscribe(
      (data) => {
        let doctorAuthResponse = data;
        // if the account is not valid yet 
        if (doctorAuthResponse.doctor.isValid == false) {
          this.router.navigate(["not-valid-account"]);
        }
        else if (doctorAuthResponse.doctor.cabinet == null){
          this.router.navigate(["dashboard/profil-manager/profil"])
        
        }else { 
          this.router.navigate(["dashboard/general"])
        
        }
        localStorage.setItem("doctorAuth", JSON.stringify(data));
      },
      (error) => {

      })
  }

}
