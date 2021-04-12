import { BindingType } from '@angular/compiler';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
//import RiveScript from "rivescript";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VirtualAssistantService {
  public onVACommand: Subject<any>;
  public onVaResponse : Subject<any> ; 
  public bot: any;
  public curentUrl: string;

  constructor(private router: Router, private zone: NgZone) {
    this.onVACommand = new Subject<any>() ; 
    this.onVaResponse = new Subject<any>() ; 
    
    // init the bot 
    this.bot = new (<any>window).RiveScript({ utf8: true });
    // load files from the brain directory 
    // save bot as constant to pass it to the brain loaded funciton
    // and save the router 
    const bot = this.bot;
    const vaCommand = this.onVACommand;
    const constRouter = this.router;
    const handleCommand = this.handleCommands;
    const getComponents = this.getComponents;

    this.bot.loadFile([
      "../assets/brain/default.rive",
      "../assets/brain/prescription.rive",
      "../assets/brain/sidebar.rive",
      "../assets/brain/vitalSetting.rive", 
      "../assets/brain/patientVisit.rive"

    ]).then(() => {
      // sort replies 
      // and perform actions
      bot.sortReplies();

    }).catch(this.loadBrainError);
  }


  public execute(command : string) {
    this.zone.run(() => {
      this.bot.reply('local-user', command.toLocaleLowerCase()).then(reply => {
        // add slaches to json data       
        reply = "{" + reply + "}" ;  
        reply = reply.replace(/'/g, "\'");
        
        console.log(reply) ; 
        
        this.handleCommands(JSON.parse(reply),
          this.onVACommand,
          this.router,
          this.getComponents);
      })
    })
  }

  private handleCommands(command, vaCommand, router, getComponents) {

    if (command.default) {
      // if this is a default command try to figure out wich components is active right now 
      const url = router.url;
      if (url.includes("pop-up-window=true")) {
        const component = getComponents(url);
        if (component)
          command.component = component;

      }
    }

    vaCommand.next(command);
  }


  private getComponents(url) {
    if (url.includes("diagnosis"))
      return "DIAGNOSIS";
    
    return null;
  }

  private loadBrainError(error) {
    console.log("failed this is error ", error);
  }
}
