import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckUp } from 'src/app/classes/CheckUp';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-check-up',
  templateUrl: './check-up.component.html',
  styleUrls: ['./check-up.component.css']
})
export class CheckUpComponent implements OnInit {
  @Input() checkUp: CheckUp;
  @Input() selectedCheckUps: CheckUp[];
  public selected: boolean = false;
  public selectEvent: EventEmitter<CheckUp>;
  constructor(private interactionService: InteractionService) {
    this.selectEvent = new EventEmitter<CheckUp>();
  }

  ngOnInit(): void {
    if (this.selectedCheckUps) {
      const index = this.selectedCheckUps.findIndex((checkUp) => checkUp.id == this.checkUp.id);
      if (index >= 0)
        this.selected = true;
    }

  }

  public select() {

    const index = this.selectedCheckUps.findIndex((checkUp) => checkUp.id == this.checkUp.id);
    if (index >= 0) {
      this.selectedCheckUps.splice(index, 1);
    } else {
      this.selectedCheckUps.push(this.checkUp);
    }
    this.selected = !this.selected;
    this.interactionService.visitEdited.next();

  }

}
