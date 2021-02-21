import { Component, OnInit , EventEmitter} from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular'; 
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
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
  public closeEvent : EventEmitter<null> ; 
  constructor(private apollo: Apollo, private interactionService : InteractionService) { 
    this.closeEvent = new EventEmitter<null>() ; 
  }
  ngOnInit(): void { 
    this.apollo.query({
      query : gql`{
        getExpensesTypes 
      }`
    }).pipe(map(value => (<any>value.data).getExpensesTypes)).subscribe((data) => { 
      this.types = data ;  
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
    })
  }
}
