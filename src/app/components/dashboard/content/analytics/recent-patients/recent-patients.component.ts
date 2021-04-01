import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import { MedicalFile } from 'src/app/classes/MedicalFile';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-recent-patients',
  templateUrl: './recent-patients.component.html',
  styleUrls: ['./recent-patients.component.css']
})
export class RecentPatientsComponent implements OnInit {
  public medicalFiles: MedicalFile[] = [];
  public currentDate: Date;
  constructor(private apollo: Apollo, private dataService: DataService) { }

  ngOnInit(): void {
    this.apollo.query({
      query: gql`
        {
          getCurrentDate
        }
      `
    }).pipe(map(value => (<any>value.data).getCurrentDate)).subscribe((data) => {
      var endDate = this.dataService.castDateYMD(data);
      this.currentDate = new Date(endDate);
      var startDate = this.dataService.dateMinusPeriod(endDate, this.dataService.MONTH);

      this.apollo.query({
        query: gql`
          {
            searchMedicalFiles(startDate : "${startDate}" , endDate : "${endDate}") {
              rows { id 
              name 
              lastname 
              birthday
              phone 
              email 
              createdAt 
              } 
            }      
          }`
      }).pipe(map(value => (<any>value.data).searchMedicalFiles.rows)).subscribe((data) => {
        for (let index = 0; index < data.length; index++) {
          data[index].createdAt = this.dataService.castFRDate(new Date(parseInt(data[index].createdAt))) ;
        
        }
        this.medicalFiles = data;

      })
    })


  }

}
