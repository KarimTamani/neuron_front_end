import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-profil-manager',
  templateUrl: './profil-manager.component.html',
  styleUrls: ['./profil-manager.component.css']
})
export class ProfilManagerComponent implements OnInit , OnDestroy{
  public selectedOption : string = "profil" ; 
  public noCabinet : boolean = false ;  
  public subscriptions : Subscription[] = [] ; 

  constructor(private router : Router , private interactionService : InteractionService) { }

  ngOnInit(): void {

    var doctorAuth = JSON.parse(localStorage.getItem("doctorAuth")) ; 
   
    if (doctorAuth.doctor.cabinet == null) 
      this.noCabinet = true  ; 

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateOptions()
      }
    })
    this.updateOptions() ; 

    this.subscriptions.push(this.interactionService.cabinetCreated.subscribe((cabinet) => { 
        this.noCabinet = false ; 
    }))
  }
  private updateOptions() {
    if (this.router.url.endsWith("profil"))
      this.selectedOption = "profil";
    else if (this.router.url.endsWith("structure"))
      this.selectedOption = "structure";
  }


  public ngOnDestroy() { 
    this.subscriptions.forEach(subs => subs.unsubscribe()) ; 
  }
}
