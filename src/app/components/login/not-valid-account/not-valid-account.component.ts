import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-valid-account',
  templateUrl: './not-valid-account.component.html',
  styleUrls: ['./not-valid-account.component.css']
})
export class NotValidAccountComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    let doctorAuth = JSON.parse(localStorage.getItem("doctorAuth"))
    if (doctorAuth == null) {
      this.router.navigate(["login"]);
    } else if (doctorAuth.doctor.isValid) {
      this.router.navigate(["dashboard/general"])
    }
  }

}
