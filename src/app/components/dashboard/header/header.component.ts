import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public doctor : any = null ; 
  constructor() { }

  ngOnInit(): void {
    this.doctor = JSON.parse(localStorage.getItem("doctorAuth")).doctor ; 
    
  }

}
