import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ALWAYS, YesNoVAResponse } from 'src/app/classes/VAResponse';
import { Visit } from 'src/app/classes/Visit';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';

@Component({
  selector: 'app-next-visit',
  templateUrl: './next-visit.component.html',
  styleUrls: ['./next-visit.component.css']
})
export class NextVisitComponent implements OnInit, OnDestroy {
  public visit: Visit;
  public price: number;
  public subscriptions : Subscription[] = [] ; 

  constructor(
    private route: ActivatedRoute, 
    private virtualAssistantService: VirtualAssistantService, 
    private apollo : Apollo , 
    private router : Router) { }

  ngOnInit(): void {
    var params = this.route.snapshot.queryParams;
    if (params["visit"]) {
      this.visit = JSON.parse(decodeURIComponent(params["visit"]));
    }
    this.price = 0;
    if (this.visit.medicalActs.length > 0) {
      this.visit.medicalActs.forEach(act => {
        this.price += act.price
      })
    }
    var l = (this.visit.medicalFile.gender) ? ("e") : ("a");
    var e = (this.visit.medicalFile.gender) ? ("") : ("e");
    this.virtualAssistantService.onVaResponse.next({
      message: `la prochaine visite est avec l${l} patient${e} ${this.visit.medicalFile.name} ${this.visit.medicalFile.lastname}, voulais vous que je lance la visite`,
      command: "lancer",
      type: ALWAYS,
      yesNo: true
    }); 



    this.subscriptions.push( this.virtualAssistantService.onVACommand.subscribe((data) => { 
      if (data.default && data.default.includes("lancer")) { 
        this.run() ; 
      }
    }) ) ;
  }


  public run() {
    if (this.visit.status == "waiting") {
      // send the patient to the visit room 
      this.apollo.mutate({
        mutation: gql`
          mutation{
            inVisit(waitingRoomId : ${this.visit.waitingRoomId} , visitId : ${this.visit.id}) {
              startTime 
            }
          }`
      }).pipe(map(value => (<any>value.data).inVisit)).subscribe((data) => {
        this.router.navigate(["/dashboard/visit"])
      })
    } else if (this.visit.status == "in visit") {
      this.router.navigate(["/dashboard/visit"])
     
    }
  }
  public ngOnDestroy() { 
    this.subscriptions.forEach(sub => { 
      sub.unsubscribe() ; 
    })
  }
}
