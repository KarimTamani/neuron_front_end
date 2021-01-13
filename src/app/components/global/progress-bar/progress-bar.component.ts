import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  @Input() progress : number ; 
  @Input() color : string ; 
  constructor() { }
  ngOnInit(): void {
  
  }
  getProgressLineWidth() {
    return {
      "width" : this.progress + "%" ,
      "backgroundColor" : this.color 
    }
  }
}
