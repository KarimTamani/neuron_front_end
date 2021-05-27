import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Visit } from 'src/app/classes/Visit';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-visit-row',
  templateUrl: './visit-row.component.html',
  styleUrls: ['./visit-row.component.css']
})
export class VisitRowComponent implements OnInit {
  @Input() visit: Visit;
  public visitPeriod: string;
  public visitDate: string;
  public visitStatus: string;
  public birthday : string ; 
  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    if (this.visit.status == "visit done" || this.visit.status == "visit payed") {
      if (this.visit.startTime && this.visit.endTime) {
        this.visitPeriod = this.dataService.getPeriod(this.visit.startTime, this.visit.endTime);
        
        this.visitPeriod = this.dataService.castTime(this.visitPeriod) ; 
      }
    }

    this.visitStatus = this.dataService.castStatusToFr(this.visit.status);
    const createdAtDate = new Date(parseInt(this.visit.createdAt));
    const day = createdAtDate.getDate();
    const month = createdAtDate.getMonth();
    const year = createdAtDate.getFullYear();
    this.birthday = this.dataService.castFRDate(new Date( this.visit.medicalFile.birthday)) ; 
    this.visitDate = `${day} ${this.dataService.monthes[month]} ${year}`
  }

  public openDetails() {
    this.router.navigate([], {
      queryParams: {
        "pop-up-window": true,
        "window-page": "visit-details",
        "title": "Détails de la visite",
        "visit-id": this.visit.id ,  
      }
    })
  }
}
