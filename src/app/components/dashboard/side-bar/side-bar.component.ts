import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';
import { ALWAYS, YesNoVAResponse } from 'src/app/classes/VAResponse';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  public activatedRouter: number = 0;
  public isActive: boolean = false;
  @Output() activeEvent: EventEmitter<null>;

  constructor(private route: ActivatedRoute, private router: Router, private virtualAssistantService: VirtualAssistantService) {
    this.activeEvent = new EventEmitter<null>();
  }

  ngOnInit(): void {

    // update side bar router at the beginings to the app 
    this.updateSideBarRouters(this.router.url)

    // every time the navigation changed update sidebar routers
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd)
        this.updateSideBarRouters(this.router.url)

    })
    this.virtualAssistantService.onVACommand.subscribe((command) => {

      this.handleCommand(command);
    })
  }

  // this function will update side bar button according to the url 
  private updateSideBarRouters(url: string) {
    if (url.includes("general"))
      this.activatedRouter = 1;
    else if (url.includes("waiting-room"))
      this.activatedRouter = 2;
    else if (url.includes("visits"))
      this.activatedRouter = 3
    else if (url.includes("medical-files"))
      this.activatedRouter = 4;
    else if (url.includes("profil"))
      this.activatedRouter = 6;
    else if (url.includes("visit"))
      this.activatedRouter = 5;
    else if (url.includes("expenses"))
      this.activatedRouter = 7;
    else if (url.includes("analytics"))
      this.activatedRouter = 8;
  }
  activeSideBar() {
    this.isActive = !this.isActive;
    this.activeEvent.emit();

  }


  private handleCommand(command) {

    if (command.component == "SIDE-BAR" || command.default) {
      const page = command.page || command.default;

      if (page.includes("accueil"))
        this.router.navigate(['/dashboard/general'])

      else if (page.includes("salle d'attente")) {
        this.router.navigate(["/dashboard/waiting-room"], { 
          queryParams : { 
            "from-va" : true 
          }
        })
        
      }
      else if (page.includes("profil"))
        this.router.navigate(["/dashboard/profil"])

      else if (page.includes("visites"))
        this.router.navigate(["dashboard/visits-and-appointments-manager/visits"])

      else if (page.includes("rendez-vous"))
        this.router.navigate(["dashboard/visits-and-appointments-manager/appointments"])

      else if (page.includes("visite"))
        this.router.navigate(["/dashboard/visit"])

      else if (page.includes("diagnostic"))
        this.router.navigate(["dashboard/documents-and-diagnosis/diagnosis"])

      else if (page.includes("frais"))
        this.router.navigate(["dashboard/financial-manager/expenses"])

      else if (page.includes("crédit"))
        this.router.navigate(["dashboard/financial-manager/debt"])

      else if (page.includes("statistiques"))
        this.router.navigate(["/dashboard/analytics"])

      else if (page.includes("dossiers") || page.includes("médicaux"))
        this.router.navigate(["/dashboard/medical-files"])
    }
  }
}
