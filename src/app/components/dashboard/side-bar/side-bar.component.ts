import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  public activatedRouter: number = 0;
  public isActive : boolean = false ; 
  @Output() activeEvent : EventEmitter<null> ; 

  constructor(private route: ActivatedRoute, private router: Router) {
    this.activeEvent = new EventEmitter<null>( ) ; 
  }

  ngOnInit(): void {

    // update side bar router at the beginings to the app 
    this.updateSideBarRouters(this.router.url)

    // every time the navigation changed update sidebar routers
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd)
        this.updateSideBarRouters(this.router.url)

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
      this.activatedRouter = 7 ; 
    else if (url.includes("analytics")) 
      this.activatedRouter = 8 ; 
  }
  activeSideBar() { 
    this.isActive = !this.isActive ; 
    this.activeEvent.emit() ; 
    
  }
}
