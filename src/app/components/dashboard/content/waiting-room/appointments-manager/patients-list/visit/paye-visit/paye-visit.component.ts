import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { InteractionService } from 'src/app/services/interaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-paye-visit',
  templateUrl: './paye-visit.component.html',
  styleUrls: ['./paye-visit.component.css']
})
export class PayeVisitComponent implements OnInit , OnDestroy{
  @Output() closeEvent : EventEmitter<null>  ; 
  public visit : Visit ; 
  public totalPrice : number ;
  public form : FormGroup = null ;
  public subsc : Subscription ; 

  public edit : boolean = false ; 
  public oldPayedMoney : number = 0 ; 
  public oldDebt : number = 0 ; 
  
  constructor(private route : ActivatedRoute , private apollo : Apollo , private interactionService : InteractionService) {
    this.closeEvent = new EventEmitter<null>() ; 
  }
  ngOnInit(): void {

    this.subsc = this.route.queryParams.subscribe((params) => {
      // get the visit from the url and decode it 
      this.visit = JSON.parse(decodeURIComponent(params.visit)) ; 
      if (this.visit.status == "visit payed") {
        this.edit = true ; 
        this.oldPayedMoney = this.visit.payedMoney ; 
        this.oldDebt = this.visit.debt ;  
      }
      this.visit.payedMoney =  0 ; 
      /// loop over the medical acts to calculate the total price
      this.visit.medicalActs.forEach((act) => {
        this.visit.payedMoney += act.price ; 
      })
      // init the form group to control the payed price not hight than the total price
      this.form = new FormGroup({
        price : new FormControl(0 , [
          Validators.required , 
          this.validePrice(this.visit.payedMoney) 
        ])
      })
      this.totalPrice = this.visit.payedMoney ; 
    })
  }
  // validation function for the payed price 
  private validePrice (maximumPrice : number) {
    return (formControl: FormControl) : ValidatorFn => {
      let value = formControl.value;
    if (value == null)
      return null;
    if (!value.toString().match(/^[0-9]/) || (parseInt(value) < 0) || parseInt(value) > maximumPrice)
      return <any>{
        "invalidPrice": true
      }
    return null;
    }
  }

  public getDebt() {

    // calculate the debt of the visit 
    if (this.totalPrice < this.visit.payedMoney) {
      this.visit.debt = 0 ; 
    }
    else {
       this.visit.debt = this.totalPrice - this.visit.payedMoney ; 
    }
    return this.visit.debt ; 
  }
  
  public payeVisit() {
    this.apollo.mutate({
      mutation : gql`
        mutation {
          payeVisit(visitId : ${this.visit.id} , payedMoney : ${this.visit.payedMoney}) {   
            id
          }
        }`
    }).pipe( map( value => (<any>value.data).payeVisit)).subscribe((data) => { 
      this.visit.status = "visit payed" ; 
      this.interactionService.visitPayed.next(this.visit) ; 
      this.closeEvent.emit() ;       
    })
  }
  ngOnDestroy () {
    this.subsc.unsubscribe() ; 
  }

  public editVisitPayment() {
      this.apollo.mutate({
        mutation : gql`
          mutation {
            editVisitPayment(visitId : ${this.visit.id} ,payedMoney : ${this.visit.payedMoney}) {
              id 
            }
          }
        `
      }).pipe(map(value => (<any>value.data).editVisitPayment)).subscribe((data) => {
        this.visit.status = "visit payed" ; 
        this.interactionService.visitPayed.next(this.visit) ; 
        this.closeEvent.emit() ;       
      })
  }
}
