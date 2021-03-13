import { Component, Input, OnInit } from '@angular/core';
import { CheckUp } from 'src/app/classes/CheckUp';

@Component({
  selector: 'app-check-up',
  templateUrl: './check-up.component.html',
  styleUrls: ['./check-up.component.css']
})
export class CheckUpComponent implements OnInit {
  @Input() checkUp : CheckUp ; 
  constructor() { }

  ngOnInit(): void {
  }

}
