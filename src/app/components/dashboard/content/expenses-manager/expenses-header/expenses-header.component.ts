import { Component, OnInit } from '@angular/core';
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
  constructor(private apollo : Apollo) { }

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

}
