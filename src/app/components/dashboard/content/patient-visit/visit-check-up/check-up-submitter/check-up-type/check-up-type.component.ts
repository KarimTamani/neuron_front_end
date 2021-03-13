import { Component, Input, OnInit } from '@angular/core';
import { CheckUpType } from 'src/app/classes/CheckUpType';

@Component({
  selector: 'app-check-up-type',
  templateUrl: './check-up-type.component.html',
  styleUrls: ['./check-up-type.component.css']
})
export class CheckUpTypeComponent implements OnInit {
  @Input() checkUpType : CheckUpType ; 
  public expand : boolean = false ; 
  constructor() { }

  ngOnInit(): void {
  }

}
