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
  public expand: boolean = false;
  @Output() selectEvent: EventEmitter<CheckUp>;
  constructor() {
    this.selectEvent = new EventEmitter<CheckUp>();
  }

  ngOnInit(): void {
  }
  public select($event) {
    this.selectEvent.emit($event);
  }
}
