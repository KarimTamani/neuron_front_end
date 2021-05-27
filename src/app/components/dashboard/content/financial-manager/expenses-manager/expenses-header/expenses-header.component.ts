import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { SUCCESS } from 'src/app/classes/Message';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-expenses-header',
  templateUrl: './expenses-header.component.html',
  styleUrls: ['./expenses-header.component.css']
})
export class ExpensesHeaderComponent implements OnInit {
  public types: string[] = [];
  public searchQuery: any = {};
  @Output() searchEvent: EventEmitter<any>;
  constructor(private apollo: Apollo, private router: Router , private interactionService : InteractionService ) {
    this.searchEvent = new EventEmitter<any>();
  }

  ngOnInit(): void {
    this.apollo.query({
      query: gql`
        { 
          getExpensesTypes
        }
      `
    }).pipe(map(value => (<any>value.data).getExpensesTypes)).subscribe((data) => {
      this.types = data;
    })
  }

  public clear() {
    this.searchQuery = {type : "Tout"};
  }

  
  public search() {
    this.searchEvent.emit({
      type: (this.searchQuery && this.searchQuery.type == "Tout") ? (null) : (this.searchQuery.type),
      startDate: this.searchQuery.startDate,
      endDate: this.searchQuery.endDate
    });
    this.interactionService.showMessage.next({
      message : "Recherche effectuée" , 
      type : SUCCESS
    })
  }

  public openAddExpense() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "add-expense",
        "title": "Ajouter un coût"
      }
    })
  }

  public keyup($event) { 
    if ($event.key == "Enter") { 
      this.search() ; 
    }
  }
}
