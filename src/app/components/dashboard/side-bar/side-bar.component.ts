import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  public activatedRouter: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) { }

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

    if (url.includes("profil"))
      this.activatedRouter = 6;
  }

}
