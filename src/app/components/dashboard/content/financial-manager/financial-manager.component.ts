import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-financial-manager',
  templateUrl: './financial-manager.component.html',
  styleUrls: ['./financial-manager.component.css']
})
export class FinancialManagerComponent implements OnInit {
  public selectedOption : string = "expenses"; 
  constructor(private router : Router) {}
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateOptions()
      }
    })
    this.updateOptions() ;
  }

  private updateOptions() {
    if (this.router.url.endsWith("expenses"))
      this.selectedOption = "expenses";
    else if (this.router.url.endsWith("debt"))
      this.selectedOption = "debt";
  }

}
