import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visit-clincal-exam',
  templateUrl: './visit-clincal-exam.component.html',
  styleUrls: ['./visit-clincal-exam.component.css']
})
export class VisitClincalExamComponent implements OnInit {
  @Input() exam : string ; 
  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  public openManager() { 
    console.log("sdksdjhs") ; 
    this.router.navigate([] , {
      queryParams : {
        "pop-up-window" : true , 
        "window-page" : "clincal-exam-manager" , 
        "title" : "Les examens cliniques" 
      }
    })
  }
}
