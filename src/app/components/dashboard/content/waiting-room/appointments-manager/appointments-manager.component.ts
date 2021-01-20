import { Component, OnInit } from '@angular/core';
import { Visit } from 'src/app/classes/Visit';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-appointments-manager',
  templateUrl: './appointments-manager.component.html',
  styleUrls: ['./appointments-manager.component.css']
})
export class AppointmentsManagerComponent implements OnInit {
  public waitingVisits: Visit[] = [<any>{
    id: 1,
    arrivalTime: "15:01",
    startTime: "15:30",
    endTime: "15:45",
    payedMoney: 0,
    status: "waiting",
    debt: 0,
    order: 1,
    medicalFile: <any>{
      name: "karim",
      lastname: "tamani",
      phone: "0549086222",
      email: "test@gmail.com",
      birthday: "1996-30-11",
      gender: true,
    }
  },
  <any>{
    id: 2,
    arrivalTime: "15:01",
    startTime: "15:30",
    endTime: "15:45",
    payedMoney: 0,
    status: "waiting",
    debt: 0,
    order: 2,
    medicalFile: <any>{
      name: "kach wa7ed",
      lastname: "tamani",
      phone: "0549086222",
      email: "test@gmail.com",
      birthday: "1996-30-11",
      gender: true,
    }
  },
  <any>{
    id: 3,
    arrivalTime: "15:01",
    startTime: "15:30",
    endTime: "15:45",
    payedMoney: 0,
    status: "waiting",
    debt: 0,
    order: 2,
    medicalFile: <any>{
      name: "kach wa7ed",
      lastname: "tamani",
      phone: "0549086222",
      email: "test@gmail.com",
      birthday: "1996-30-11",
      gender: true,
    }
  },
  <any>{
    id: 4,
    arrivalTime: "15:01",
    startTime: "15:30",
    endTime: "15:45",
    payedMoney: 0,
    status: "waiting",
    debt: 0,
    order: 2,
    medicalFile: <any>{
      name: "kach wa7ed",
      lastname: "tamani",
      phone: "0549086222",
      email: "test@gmail.com",
      birthday: "1996-30-11",
      gender: true,
    }
  },
  <any>{
    id: 5,
    arrivalTime: "15:01",
    startTime: "15:30",
    endTime: "15:45",
    payedMoney: 0,
    status: "waiting",
    debt: 0,
    order: 2,
    medicalFile: <any>{
      name: "kach wa7ed",
      lastname: "tamani",
      phone: "0549086222",
      email: "test@gmail.com",
      birthday: "1996-30-11",
      gender: true,
    }
  },
  <any>{
    id: 6,
    arrivalTime: "15:01",
    startTime: "15:30",
    endTime: "15:45",
    payedMoney: 0,
    status: "waiting",
    debt: 0,
    order: 2,
    medicalFile: <any>{
      name: "kach wa7ed",
      lastname: "tamani",
      phone: "0549086222",
      email: "test@gmail.com",
      birthday: "1996-30-11",
      gender: true,
    }
  }];


  public visitsDone: Visit[] = []
  public nextSubject: Subject<number>;
  public currentVisit: Visit;
  constructor() { }

  ngOnInit(): void {
    this.nextSubject = new Subject<number>();
  }
  next() {
    if (this.currentVisit) { 

      this.waitingVisits.splice(0 , 1) ;
      this.visitsDone.splice( 0 , 0 , this.currentVisit) ;  

    }
    if (this.waitingVisits.length > 0) {
      this.nextSubject.next(this.waitingVisits[0].id);
      this.currentVisit = this.waitingVisits[0] ; 
    }
  }
}
