import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-profil-manager',
  templateUrl: './profil-manager.component.html',
  styleUrls: ['./profil-manager.component.css']
})
export class ProfilManagerComponent implements OnInit {
  public selectedOption : string = "profil" ; 
 
  constructor(private router : Router) { }

  ngOnInit(): void {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateOptions()
      }
    })
    this.updateOptions() ; 
  }
  private updateOptions() {
    if (this.router.url.endsWith("profil"))
      this.selectedOption = "profil";
    else if (this.router.url.endsWith("structure"))
      this.selectedOption = "structure";
  }
}
