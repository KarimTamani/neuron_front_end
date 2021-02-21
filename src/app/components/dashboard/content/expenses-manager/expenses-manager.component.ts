import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Expense } from "../../../../classes/Expense";
@Component({
  selector: 'app-expenses-manager',
  templateUrl: './expenses-manager.component.html',
  styleUrls: ['./expenses-manager.component.css']
})
export class ExpensesManagerComponent implements OnInit {
  public expenses: Expense[] = [];
  public searchQuery : any = {} ; 
  public offset : number = 0 ; 
  public limit : number = 10 ;  
  constructor(private apollo: Apollo) { }

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
      console.log(this.expenses) ; 
    })
  
  }
}
