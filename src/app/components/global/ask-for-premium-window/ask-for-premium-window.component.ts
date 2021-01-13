import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag" ; 
import { map } from "rxjs/operators" ; 
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-ask-for-premium-window',
  templateUrl: './ask-for-premium-window.component.html',
  styleUrls: ['./ask-for-premium-window.component.css']
})
export class AskForPremiumWindowComponent implements OnInit {
  public thanks : boolean = false ; 
  constructor(private router : Router , private apollo : Apollo , private interactionService : InteractionService) { }

  ngOnInit(): void {
  
  }


  public close() {
    this.router.navigate([]) ; 
  }
  public sendRequest() {
    // set a request to apollo server 
    this.apollo.mutate({
      mutation : gql`
        mutation {
          askForPremiumVersion
        }`
    }).pipe(map(result => (<any>result.data).askForPremiumVersion)).subscribe((data) => {
      
      
      // update the doctor Auth in the local storage set the premium request to true value 
      // and save it again for future usage
      // set thanks to true to show success message
      let doctorAuth = JSON.parse(localStorage.getItem("doctorAuth")) ; 
      doctorAuth.doctor.premiumRequest = data ; 
      localStorage.setItem("doctorAuth" , JSON.stringify(doctorAuth)) ; 
      this.thanks = true ; 
      this.interactionService.askForPremiumRequestSubject.next() ; 
    })
  }
}
