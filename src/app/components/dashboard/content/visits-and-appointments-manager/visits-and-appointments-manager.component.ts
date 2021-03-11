import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-visits-and-appointments-manager',
  templateUrl: './visits-and-appointments-manager.component.html',
  styleUrls: ['./visits-and-appointments-manager.component.css']
})
export class VisitsAndAppointmentsManagerComponent implements OnInit {
  public selectedOption: string = "visits";
  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateOptions()
      }
    })
    this.updateOptions() ; 
  }

  private updateOptions() {
    if (this.router.url.endsWith("visits"))
      this.selectedOption = "visits";
    else if (this.router.url.endsWith("appointments"))
      this.selectedOption = "appointments";

  }

}
