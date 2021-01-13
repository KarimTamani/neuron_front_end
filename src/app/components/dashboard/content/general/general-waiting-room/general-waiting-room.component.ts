import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-waiting-room',
  templateUrl: './general-waiting-room.component.html',
  styleUrls: ['./general-waiting-room.component.css']
})
export class GeneralWaitingRoomComponent implements OnInit {
  public patients: any[] = [
    {
      name: "Prénom",
      lastname: "Nom",
      age: 24,
      visit_start: "9:00",
      visit_end: "9:30" , 
      gender : true 
    } ,{
      name: "Prénom",
      lastname: "Nom",
      age: 24,
      visit_start: "9:30",
      visit_end: "10:30" , 
      gender : true 
    } ,{
      name: "Prénom",
      lastname: "Nom",
      age: 24,
      visit_start: "10:30",
      visit_end: "10:45" , 
      gender : true 
    } ,{
      name: "Prénom",
      lastname: "Nom",
      age: 24,
      visit_start: "10:45",
      visit_end: "11: 30" , 
      gender : true 
    } ,
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
