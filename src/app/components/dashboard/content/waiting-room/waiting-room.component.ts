import { Component, OnInit } from '@angular/core';
import { Visit } from "../../../../classes/Visit";

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.css']
})
export class WaitingRoomComponent implements OnInit {
  
  public visits : Visit[] = [<any>{
    arrivalTime : "15:01" , 
    startTime : "15:30" , 
    endTime : "15:45" , 
    payedMoney : 0 , 
    status : "waiting" , 
    debt : 0 , 
    order : 1 , 
    medicalFile : <any>{
      name : "karim" , 
      lastname : "tamani" , 
      phone : "0549086222" , 
      email : "test@gmail.com" , 
      birthday : "1996-30-11" , 
      gender : true , 
    }
  }]
  
  constructor() {}
  
  ngOnInit(): void {

  }

}
