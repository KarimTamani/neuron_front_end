import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public limit : number = 1  ;  
  public count : number = 0 ; 
  public subscriptions : Subscription[] = [] ; 
  constructor(private apollo: Apollo , private interactionSerivce : InteractionService , private router : Router) {}

  ngOnInit(): void {
    this.getAllExpenses(null , null , null , this.offset , this.limit) ; 
  }
  private getAllExpenses(type = null , startDate = null , endDate = null , offset = 0 , limit = 100) {
    this.apollo.query({
      query: gql`
      query GET_EXPENSES($type : String , $startDate : String , $endDate : String , $offset : Int , $limit: Int) {
        getExpenses(type : $type , startDate : $startDate , endDate : $endDate , offset : $offset , limit : $limit) {
          rows { id price type createdAt } 
          count 
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
      this.expenses = data.rows ;
      this.count = data.count ;   
    })

    this.subscriptions.push(this.interactionSerivce.newExpenseAdded.subscribe((data) => { 
      this.expenses.splice(0, 0, data) ; 
    }))
  }

  public selectPage($event) { 
    this.offset = $event ; 
    this.getAllExpenses(
      this.searchQuery.type , 
      this.searchQuery.startDate , 
      this.searchQuery.endDate , 
      this.offset , 
      this.limit
    ) ; 
  }

  public search($event) { 
    this.searchQuery = $event ; 
    this.offset = 0 ; 
    console.log(this.searchQuery) ; 
    this.getAllExpenses(
      this.searchQuery.type , 
      this.searchQuery.startDate , 
      this.searchQuery.endDate , 
      this.offset , 
      this.limit
    ) ;
  }

  public ngOnDestroy() { 
    this.subscriptions.forEach((subs) => { 
      subs.unsubscribe() ; 
    })
  }

  
  public edit (expense) { 
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page" : "add-expense" , 
        "title" :"ajouter un frais" , 
        "expense" : encodeURIComponent(JSON.stringify(expense)) 
      }
    })  
    const subscription = this.interactionSerivce.editExpense.subscribe((data) => { 
      const index = this.expenses.findIndex((value) => value.id == expense.id) ;
      this.expenses.splice(index , 1 , data) ; 
      subscription.unsubscribe() ; 
    })
  }



  public delete(id) { 
    this.apollo.mutate({
      mutation : gql`
        mutation {
          removeExpense(expenseId : ${id}) 
        }`
    }).pipe(map(value => (<any>value.data).removeExpense)).subscribe((data) => { 
      if (data) { 
        const index = this.expenses.findIndex(value => value.id == data) ;
        this.expenses.splice(index , 1) ;  
      }
    })
  }
}
