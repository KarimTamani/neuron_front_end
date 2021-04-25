import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CheckUp } from 'src/app/classes/CheckUp';
import { CheckUpType } from 'src/app/classes/CheckUpType';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-check-up-type',
  templateUrl: './check-up-type.component.html',
  styleUrls: ['./check-up-type.component.css']
})
export class CheckUpTypeComponent implements OnInit, OnDestroy {
  @Input() checkUpType: CheckUpType;
  @Input() selectedCheckUps: CheckUp[];
  @Input() controllable: boolean = false;
  public subscriptions: Subscription[] = [];
  public expand: boolean = false;

  constructor(private router: Router, private interactionService: InteractionService) {

  }
  ngOnInit(): void {

  }

  public edit() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "check-up-type-submitter",
        "title": "Modifer le type de bilan",
        "check-up-type": encodeURIComponent(JSON.stringify(this.checkUpType))
      }
    });
    const subs = this.interactionService.checkUpTypeEdited.subscribe(data => {
      this.checkUpType.name = data.name;
      subs.unsubscribe();
    })

    this.subscriptions.push(subs);
  }

  public delete() {

  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }
}
