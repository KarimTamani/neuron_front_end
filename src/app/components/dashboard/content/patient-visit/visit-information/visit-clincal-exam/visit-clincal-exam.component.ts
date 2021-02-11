import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-visit-clincal-exam',
  templateUrl: './visit-clincal-exam.component.html',
  styleUrls: ['./visit-clincal-exam.component.css']
})
export class VisitClincalExamComponent implements OnInit {
  @Input() exam : string ; 
  constructor(private router : Router , private interactionService : InteractionService) { }

  ngOnInit(): void {
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
    })
  }
}
