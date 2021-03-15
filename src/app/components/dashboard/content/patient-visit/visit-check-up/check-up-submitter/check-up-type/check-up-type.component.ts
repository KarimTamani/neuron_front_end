import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckUp } from 'src/app/classes/CheckUp';
import { CheckUpType } from 'src/app/classes/CheckUpType';

@Component({
  selector: 'app-check-up-type',
  templateUrl: './check-up-type.component.html',
  styleUrls: ['./check-up-type.component.css']
})
export class CheckUpTypeComponent implements OnInit {
  @Input() checkUpType: CheckUpType;
  @Input() selectedCheckUps : CheckUp[]   ; 
  public expand: boolean = false; 
  constructor() {
  }
  ngOnInit(): void { 
  }
}
