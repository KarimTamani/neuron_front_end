import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-expenses-header',
  templateUrl: './expenses-header.component.html',
  styleUrls: ['./expenses-header.component.css']
})
export class ExpensesHeaderComponent implements OnInit {
  public types : string[] = [] ; 
  constructor(private apollo : Apollo , private router : Router) { }

  ngOnInit(): void {
    this.apollo.query({
      query : gql`
        { 
          getExpensesTypes
        }
      `
    }).pipe(map(value => (<any>value.data).getExpensesTypes)).subscribe((data) => { 
      this.types = data ; 
    })
  }


  public openAddExpense() { 
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page" : "add-expense" , 
        "title" :"ajouter un frais" 
      }
    })  
  }
}
