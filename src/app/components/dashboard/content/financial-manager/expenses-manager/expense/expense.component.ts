import { Component, Input, OnInit , EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Expense } from 'src/app/classes/Expense';
import { DataService } from 'src/app/services/data.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit , OnDestroy {
  @Input() expense: Expense;
  public creationDate: string;
  @Output() deleteEvent : EventEmitter<number> ; 
  @Output() editEvent : EventEmitter<Expense> ; 
  public subscriptions : Subscription[] = [] ; 
  constructor(private dataService: DataService , private router : Router , private interactionService : InteractionService) {
    this.deleteEvent = new EventEmitter<number>() ; 
    this.editEvent = new EventEmitter<Expense>() ; 
  }

  ngOnInit(): void {

    const date = new Date(parseInt ( this.expense.createdAt ));
    
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const currentDay = date.getDate();

    this.creationDate = `${currentDay} ${this.dataService.monthes[currentMonth]} ${currentYear}`
    
    console.log(this.expense) ;  
  }
  

  public edit() {
    this.editEvent.emit(this.expense) ; 
  }
  public delete() {
    this.router.navigate([] , { 
      queryParams : { 
        "pop-up-window" : true , 
        "window-page" : "yes-no-message" , 
        "title" : "Suppression des frais" , 
        "message" : "vous voulez vraiment supprimer ce coût ?" , 
        "tag" : "EXPENSE"
      }
    })

    const subs  = this.interactionService.yesOrNo.subscribe((response) => { 
      if  ( response && response.tag == "EXPENSE") { 
          this.deleteEvent.emit(this.expense.id)  ;
      }
      subs.unsubscribe()  ;
    }) ; 
    this.subscriptions.push( subs ) ; 
  }

  public ngOnDestroy () { 
    this.subscriptions.forEach(subs => subs.unsubscribe()) ; 
  }
}
