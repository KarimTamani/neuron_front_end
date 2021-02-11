import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';
import { ClinicalExam } from 'src/app/classes/ClincalExam';

@Component({
  selector: 'app-visit-clincal-exam',
  templateUrl: './visit-clincal-exam.component.html',
  styleUrls: ['./visit-clincal-exam.component.css']
})
export class VisitClincalExamComponent implements OnInit {
  @Input() exam : string ; 
  @Output() onChange : EventEmitter<string> ; 
  constructor(private router : Router , private interactionService : InteractionService) {
    this.onChange = new EventEmitter<string>() ; 
  }

  ngOnInit(): void {
  
  }
  change() {
    this.onChange.emit(this.exam) ; 
  }

  public openManager() { 
    this.router.navigate([] , {
      queryParams : {
        "pop-up-window" : true , 
        "window-page" : "clincal-exam-manager" , 
        "title" : "Les examens cliniques" 
      }
    }); 
    const subscription = this.interactionService.useClinicalExam.subscribe((data) => {
      this.exam = data.exam ; 
      subscription.unsubscribe() ; 
      this.onChange.emit(this.exam) ; 
    })
  }
}
