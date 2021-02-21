import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { InteractionService } from 'src/app/services/interaction.service';
import { Expense } from "../../../../classes/Expense";
@Component({
  selector: 'app-expenses-manager',
  templateUrl: './expenses-manager.component.html',
  styleUrls: ['./expenses-manager.component.css']
})
export class ExpensesManagerComponent implements OnInit , OnDestroy {
  public expenses: Expense[] = [];
  public searchQuery : any = {} ; 
  public offset : number = 0 ; 
  public limit : number = 10 ;  
  public subscriptions : Subscription[] = [] ; 
  constructor(private apollo: Apollo , private interactionSerivce : InteractionService) {}

  ngOnInit(): void {
    this.getAllExpenses() ; 
  }
  private getAllExpenses(type = null , startDate = null , endDate = null , offset = 0 , limit = 100) {
    this.apollo.query({
      query: gql`
      query GET_EXPENSES($type : String , $startDate : String , $endDate : String , $offset : Int , $limit: Int) {
        getExpenses(type : $type , startDate : $startDate , endDate : $endDate , offset : $offset , limit : $limit) {
          id price type createdAt
        }
      }
      `, variables : { 
        type : type , 
        startDate : startDate , 
        endDate : endDate , 
        offset : offset , 
        limit : limit  
      }
    }).pipe(map(value => (<any>value.data).getExpenses)).subscribe((data) => {
      this.expenses = data ;  
    })

    this.subscriptions.push(this.interactionSerivce.newExpenseAdded.subscribe((data) => { 
      this.expenses.splice(0, 0, data) ; 
    }))
  }

  public ngOnDestroy() { 
    this.subscriptions.forEach((subs) => { 
      subs.unsubscribe() ; 
    })
  }
}
