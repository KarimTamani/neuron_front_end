import { Component, OnInit, OnDestroy } from '@angular/core';
import { InteractionService } from 'src/app/services/interaction.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-general-subscription',
  templateUrl: './general-subscription.component.html',
  styleUrls: ['./general-subscription.component.css']
})
export class GeneralSubscriptionComponent implements OnInit , OnDestroy {
  public allReadyRequested: boolean = false ;
  public subscription: Subscription[] = [];
  constructor(private interactionService: InteractionService) { }

  ngOnInit(): void {

    this.subscription.push(this.interactionService.askForPremiumRequestSubject.subscribe(() => {
      this.allReadyRequested = true ; 
    }))

    let doctorAuth = JSON.parse(localStorage.getItem("doctorAuth")) ; 
    this.allReadyRequested = doctorAuth.doctor.premiumRequest  ; 

  }
  ngOnDestroy() {
    this.subscription.forEach((subscription) => {
      subscription.unsubscribe() ; 
    })
  }

}
