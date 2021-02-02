import { Component, OnInit, Input } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { WaitingRoomReport, Report } from "../../../../../../classes/Report";
import gql from 'graphql-tag';
import { DataService } from 'src/app/services/data.service';
import { map } from 'rxjs/operators';
import { InteractionService } from 'src/app/services/interaction.service';
@Component({
  selector: 'app-waiting-room-report',
  templateUrl: './waiting-room-report.component.html',
  styleUrls: ['./waiting-room-report.component.css']
})
export class WaitingRoomReportComponent implements OnInit {

  @Input() currentDate: Date;

  public waitingRoomReport: WaitingRoomReport;

  constructor(private apollo: Apollo, private dataService: DataService , private interactionService : InteractionService) {
    this.waitingRoomReport = new WaitingRoomReport();
  }

  ngOnInit(): void {
    // get the date from the ucrrent date
    // and load the report 
    const date = this.dataService.castDateYMD(this.currentDate.toString());
    this.loadWaitingRoomReport(date) ; 
    // every time something changes in the waiting room 
    // update the reports 
    this.interactionService.updateReport.subscribe(() => { 

      this.loadWaitingRoomReport(date) ; 
    })
    
  }

  private loadWaitingRoomReport(date ) { 
    this.apollo.query({
      query: gql`
        {
          getWaitingRoomReport(date : "${date}") { 
            waiting { 
              count
              startTime 
              endTime 
              period 
              money 
            }, 
            inVisit { 
              name 
              lastname 
              count 
              startTime  
              period
            }, 
            done { 
              count 
              startTime 
              endTime 
              period 
              money 
              debt
            }
            ignored { 
              count 
              money 
            }
          }
        }`
    }).pipe(map(value => (<any>value.data).getWaitingRoomReport)).subscribe((data) => {
      if (data.waiting)
        this.waitingRoomReport.waiting = data.waiting;
      else 
        this.waitingRoomReport.waiting = new Report() ; 
      if (data.done)
        this.waitingRoomReport.done = data.done;
      else 
        this.waitingRoomReport.done = new Report() ; 
      if (data.ignored)
        this.waitingRoomReport.ignored = data.ignored;
      else 
        this.waitingRoomReport.ignored = new Report() ; 
      if (data.inVisit)
        this.waitingRoomReport.inVisit  = data.inVisit;
      else 
        this.waitingRoomReport.inVisit = new Report() ; 
    })

  }

}
