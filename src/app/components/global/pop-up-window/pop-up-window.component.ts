import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-pop-up-window',
  templateUrl: './pop-up-window.component.html',
  styleUrls: ['./pop-up-window.component.css']
})
export class PopUpWindowComponent implements OnInit {
  public windowPage : string = null ; 
  public title : string = "Titre" ; 
  constructor(private route : ActivatedRoute , private router : Router) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params : ParamMap) => {
      // extrect window page from queryParams of the url 
      let windowPage = params.get("window-page")
      if (windowPage !== null) {
        this.windowPage = windowPage 
      }
      let title = params.get("title") 
      if (title !== null) 
        this.title = title ; 
    })
  }
  preventPropagation($event) {
    $event.stopPropagation( )
  }
  close() {
    this.router.navigate([]) ; 
  }
}
