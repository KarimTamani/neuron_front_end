import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visit-header',
  templateUrl: './visit-header.component.html',
  styleUrls: ['./visit-header.component.css']
})
export class VisitHeaderComponent implements OnInit {
  @Output() selectPageEvent : EventEmitter<number> ; 
  @Input() visit : Visit ; 
  public selectedPage : number = 1 ; 
  constructor(private router : Router) {
    this.selectPageEvent = new EventEmitter<number>();  
  }

  ngOnInit(): void {
  }
  select(page : number) { 
    this.selectedPage = page ; 
    this.selectPageEvent.emit (page) ; 
  }

  openDiagnosis() { 
    console.log(this.visit) ; 
     this.router.navigate([] , {
       queryParams : {
        'pop-up-window' : true , 
        'window-page' : 'diagnosis' , 
        'title' : "Diagnostic symptomatique" , 
        'visit' : decodeURIComponent(JSON.stringify(this.visit))
       }
     }) ; 
  }
}
