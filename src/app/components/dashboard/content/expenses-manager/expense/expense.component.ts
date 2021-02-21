import { Component, Input, OnInit , EventEmitter, Output } from '@angular/core';
import { Expense } from 'src/app/classes/Expense';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  @Input() expense: Expense;
  public creationDate: string;
  @Output() deleteEvent : EventEmitter<number> ; 
  @Output() editEvent : EventEmitter<Expense>
  constructor(private dataService: DataService) {
    this.deleteEvent = new EventEmitter<number>() ; 
    this.editEvent = new EventEmitter<Expense>() ; 
  }

  ngOnInit(): void {

    const date = new Date(parseInt ( this.expense.createdAt ));
    
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const currentDay = date.getDate();

    this.creationDate = `${currentDay} ${this.dataService.monthes[currentMonth]} ${currentYear}`
  }
  

  public edit() {
    this.editEvent.emit(this.expense) ; 
  }
  public delete() {
    this.deleteEvent.emit(this.expense.id) ;
  }
}
