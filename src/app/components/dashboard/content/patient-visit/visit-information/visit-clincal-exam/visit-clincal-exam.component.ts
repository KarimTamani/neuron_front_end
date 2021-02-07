import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-visit-clincal-exam',
  templateUrl: './visit-clincal-exam.component.html',
  styleUrls: ['./visit-clincal-exam.component.css']
})
export class VisitClincalExamComponent implements OnInit {
  @Input() exam : string ; 
  constructor() { }

  ngOnInit(): void {
  }

}
