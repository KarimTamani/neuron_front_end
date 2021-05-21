import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-visit-clincal-exam',
  templateUrl: './visit-clincal-exam.component.html',
  styleUrls: ['./visit-clincal-exam.component.css']
})
export class VisitClincalExamComponent implements OnInit , OnDestroy{
  @Input() exam: string;
  @Output() onChange: EventEmitter<string>;
  @Input() active: boolean = false;
  public subscriptions : Subscription[] = []  ;
  
  constructor(private router: Router, private interactionService: InteractionService) {
    this.onChange = new EventEmitter<string>();
  }

  ngOnInit(): void {

  }
  change() {
    this.onChange.emit(this.exam);
    if (this.exam.trim().length > 0)
      this.interactionService.visitEdited.next();



    const subscription = this.interactionService.useClinicalExam.subscribe((data) => {
      this.exam = data.exam;
      this.onChange.emit(this.exam);
    }) ; 

    this.subscriptions.push(subscription) ; 

  }

  public openManager() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "clincal-exam-manager",
        "title": "Examens cliniques"
      }
    });
  
  }


  public ngOnDestroy() { 
    this.subscriptions.forEach((subs) => subs.unsubscribe()) ; 
  }

}
