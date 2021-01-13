import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Apollo } from 'apollo-angular';
import gql from "graphql-tag";
import { map } from "rxjs/operators";
import { LocalState } from 'apollo-client/core/LocalState';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(public router: Router, private apollo: Apollo) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apollo.query({
        query: gql`
          query {
            getDoctorProfil {
              id , isValid 
            }
          }`
      }).pipe(map(result => (<any>result.data).getDoctorProfil)).subscribe(
        (data) => {
          if (data.isValid == false)
            this.router.navigate(["not-valid-account"])
          resolve(data.isValid);
        },
        (error) => {
          localStorage.removeItem("doctorAuth") 
          this.router.navigate(["login"])
          resolve(false);
        }
      )
    })
  }
}
