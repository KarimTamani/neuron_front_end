import { Route } from '@angular/compiler/src/core';
import { Component, OnInit , EventEmitter, Output} from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo } from 'apollo-angular'; 
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { Expense } from 'src/app/classes/Expense';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {
  public types : string[] = [] ; 
  public form : FormGroup = new FormGroup({
    type : new FormControl("" , [
      Validators.required 
    ]) , 
    price : new FormControl("" , [
      Validators.required, 
      this.numericAndPositive 
    ])
  }); 
  @Output() closeEvent : EventEmitter<null> ; 
  public expense : Expense ; 
  constructor(private apollo: Apollo, private interactionService : InteractionService , private route : ActivatedRoute ) { 
    this.closeEvent = new EventEmitter<null>() ; 
    this.expense = new Expense() ; 
  }
  ngOnInit(): void { 
    this.apollo.query({
      query : gql`{
        getExpensesTypes 
      }`
    }).pipe(map(value => (<any>value.data).getExpensesTypes)).subscribe((data) => { 
      this.types = data ;  
    })

    this.route.queryParams.subscribe((params) => { 
      if (params["expense"]) { 
        this.expense = JSON.parse(decodeURIComponent(params["expense"])) ; 
      }
    })
  }

  private numericAndPositive(formControl: FormControl): ValidatorFn {
    let value = formControl.value;
    if (value == null || value.length == 0)
      return null;
    if (!value.toString().match(/^[0-9]/) || (parseInt(value) <= 0))
      return <any>{
        "invalidNumber": true
      }
    return null;
  }

  public submit() { 
    
    this.apollo.mutate({
      mutation : gql`
        mutation ADD_EXPENSE($expense : ExpenseInput!) { 
          addExpense(expense : $expense) { 
            id price type createdAt updatedAt
          }
        }`,variables : { 
          expense : { 
            price : this.form.value.price , 
            type : this.form.value.type 
          }
        }
    }).pipe(map(value => (<any>value.data).addExpense)).subscribe((data) => { 
      this.interactionService.newExpenseAdded.next(data) ; 
      this.closeEvent.emit() ; 
    })
  }

  public edit () { 
    this.apollo.mutate({
      mutation : gql`
        mutation EDIT_EXPENSE($expense : ExpenseInput!) { 
          editExpense(expenseId : ${this.expense.id} ,  expense : $expense)  
        }`,variables : { 
          expense : { 
            price : this.form.value.price , 
            type : this.form.value.type 
          }
        }
    }).pipe(map(value => (<any>value.data).addExpense)).subscribe((data) => { 
      this.interactionService.editExpense.next(this.expense) ; 
      this.closeEvent.emit() ; 
    })
  }
}
