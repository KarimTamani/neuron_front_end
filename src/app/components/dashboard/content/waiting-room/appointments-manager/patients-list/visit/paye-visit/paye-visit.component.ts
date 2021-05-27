import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { InteractionService } from 'src/app/services/interaction.service';
import { Message, SUCCESS } from 'src/app/classes/Message';

@Component({
  selector: 'app-paye-visit',
  templateUrl: './paye-visit.component.html',
  styleUrls: ['./paye-visit.component.css']
})
export class PayeVisitComponent implements OnInit {
  @Output() closeEvent: EventEmitter<null>;
  public visit: Visit;
  public totalPrice: number;
  public form: FormGroup = null;

  public edit: boolean = false;
  public oldPayedMoney: number = 0;
  public oldDebt: number = 0;

  public submitFirst: boolean = false;


  constructor(private route: ActivatedRoute, private apollo: Apollo, private interactionService: InteractionService) {
    this.closeEvent = new EventEmitter<null>();
  }
  ngOnInit(): void {

    var params = this.route.snapshot.queryParams
    // get the visit from the url and decode it 
    this.visit = JSON.parse(decodeURIComponent(params.visit));
    if (this.visit.medicalActs.length == 0)
      this.submitFirst = true;
    if (this.visit.status == "visit payed") {
      this.edit = true;
      this.oldPayedMoney = this.visit.payedMoney;
      this.oldDebt = this.visit.debt;
    }
    this.visit.payedMoney = 0;
    /// loop over the medical acts to calculate the total price
    this.visit.medicalActs.forEach((act) => {
      this.visit.payedMoney += act.price;
    })
    // init the form group to control the payed price not hight than the total price
    this.form = new FormGroup({
      price: new FormControl(0, [
        Validators.required,
        this.validePrice(this.visit.payedMoney)
      ])
    })
    this.totalPrice = this.visit.payedMoney;
  }
  // validation function for the payed price 
  private validePrice(maximumPrice: number) {




    return (formControl: FormControl): ValidatorFn => {
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
      this.visit.debt = 0;
    }
    else {
      this.visit.debt = this.totalPrice - this.visit.payedMoney;
    }
    return this.visit.debt;
  }

  public async payeVisit() {

    if (this.submitFirst) {
      await this.addVisitMedicalActs();
    }

    this.apollo.mutate({
      mutation: gql`
        mutation {
          payeVisit(visitId : ${this.visit.id} , payedMoney : ${this.visit.payedMoney}) {   
            id
          }
        }`
    }).pipe(map(value => (<any>value.data).payeVisit)).subscribe((data) => {
      this.visit.status = "visit payed";
      this.interactionService.visitPayed.next(this.visit);
      this.closeEvent.emit();
      this.interactionService.showMessage.next(<Message>{
        message : `paiement effectué ${(this.visit.debt) ? ("avec crédit") : ("")}` , 
        type : SUCCESS
      })
    })
  }




  public update($event) {
    this.visit.payedMoney = 0;
    /// loop over the medical acts to calculate the total price
    this.visit.medicalActs.forEach((act) => {
      this.visit.payedMoney += act.price;
    })

    this.totalPrice = this.visit.payedMoney;
    // init the form group to control the payed price not hight than the total price
    this.form = new FormGroup({
      price: new FormControl(0, [
        Validators.required,
        this.validePrice(this.visit.payedMoney)
      ])
    })
  }




  private async addVisitMedicalActs() {
    return await this.apollo.mutate({
      mutation: gql`
        mutation ADD_MEDICAL_ACTS( $visitId : ID! , $medicalActs : [ID!]!) { 
          addVisitMedicalActs(
            visitId : $visitId , 
            medicalActs : $medicalActs
          )
        }
      `, variables: {
        visitId: this.visit.id,
        medicalActs: this.visit.medicalActs.map(value => value.id)
      }
    }).pipe(map(value => (<any>value.data).addVisitMedicalActs)).toPromise()
  }

  public editVisitPayment() {
    this.apollo.mutate({
      mutation: gql`
          mutation {
            editVisitPayment(visitId : ${this.visit.id} ,payedMoney : ${this.visit.payedMoney}) {
              id 
            }
          }
        `
    }).pipe(map(value => (<any>value.data).editVisitPayment)).subscribe((data) => {
      this.visit.status = "visit payed";
      this.interactionService.visitPayed.next(this.visit);
      this.interactionService.showMessage.next(<Message>{
        message : `paiement effectué ${(this.visit.debt) ? ("avec crédit") : ("")}` , 
        type : SUCCESS
      })
      this.closeEvent.emit();
    })
  }
}
