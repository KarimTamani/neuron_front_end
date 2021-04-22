import { Component, OnInit,EventEmitter, Output} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

import { Visit } from 'src/app/classes/Visit';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-edit-debt',
  templateUrl: './edit-debt.component.html',
  styleUrls: ['./edit-debt.component.css']
})
export class EditDebtComponent implements OnInit {
  public visit: Visit;
  public totalPrice: number = 0;
  @Output() closeEvent : EventEmitter<null> ;  
  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private interactionService: InteractionService
  ) {
    this.closeEvent = new EventEmitter<null>() ; 
  }

  ngOnInit(): void {
    var params = this.route.snapshot.queryParams;
    if (params["visit"])
      this.visit = JSON.parse(decodeURIComponent(params["visit"]));
    
    this.visit.medicalActs.forEach(act => this.totalPrice += act.price);
  }


  public edit() {

    this.visit.payedMoney = this.totalPrice;
    this.visit.debt = 0;


    this.apollo.mutate({
      mutation: gql`
        mutation {
          editVisitPayment(visitId : ${this.visit.id} ,payedMoney : ${this.visit.payedMoney}) {
            id 
          }
        }
      `
    }).pipe(map(value => (<any>value.data).editVisitPayment)).subscribe((data) => {
      
      this.interactionService.visitPayed.next(this.visit);
      this.closeEvent.emit();
    })

  }

}
