import { Component, NgZone, OnInit } from '@angular/core';
import { VirtualAssistantService } from 'src/app/services/virtual-assistant-service';
import { ONCE, RANDOM, VAResponse, YesNoVAResponse } from "../../../classes/VAResponse";
@Component({
  selector: 'app-virtual-assistant-controller',
  templateUrl: './virtual-assistant-controller.component.html',
  styleUrls: ['./virtual-assistant-controller.component.css']
})
export class VirtualAssistantControllerComponent implements OnInit {
  // two attributes to describe the state of the VA is she speaking or listening
  public isRecording: boolean = false;
  public isSpeaking: boolean = false;
  public showYesNo : boolean = false ; 

  public tts: SpeechSynthesis;
  public toSpeech: SpeechSynthesisUtterance;
  public recognition: any;

  public command: string = "";
  public waitingHandler = null ; 

  // the response that the assistant sould speak 
  public vaResponse: VAResponse;

  // init the welcoming message 
  // each message should be speakable once so we don't bather the doctor

  private welcoming: VAResponse[] = [
    <VAResponse>{
      message: "je suis a vous service",
      speakable: ONCE
    },

    <VAResponse>{
      message: "ce que je peux faire pour vous",
      speakable: ONCE
    },
    <VAResponse>{
      message: "Comment puis-je vous aider",
      speakable: ONCE
    },
    <VAResponse>{
      message: "à votre service",
      speakable: ONCE
    }
  ];
  // save the one speakable va response to check if it's allready speaked or not
  private onceVaResponses: VAResponse[] = [];

  constructor(private zone: NgZone, private virtualAssistantService: VirtualAssistantService) { }

  private getWelcominMessage() {
    // ge a random index  of the welcoming array and return the response to speak of course 
    var index = Math.trunc(Math.random() * 10) % this.welcoming.length;
    return this.welcoming[index];

  }


  async ngOnInit() {

    // init the text to speak with the FR voice 
    this.tts = window.speechSynthesis;
    window.speechSynthesis.onvoiceschanged = async () => {
      const updatedVoices = window.speechSynthesis.getVoices();

      var frVoice = updatedVoices.filter(voice => voice.lang == "fr-FR").pop();
      this.toSpeech = new SpeechSynthesisUtterance();
      this.toSpeech.lang = 'fr-FR';
      this.toSpeech.pitch = 1.1;
      this.toSpeech.volume = 0.2;
      this.toSpeech.rate = 1;

      this.toSpeech.voice = frVoice;

    };

    this.virtualAssistantService.onVaResponse.subscribe((response: any) => {
      
      this.zone.run(async () => {
        this.command = "" ; 
        this.vaResponse = response;
        //this.listen();
        await this.speak(this.vaResponse);
        if ((<YesNoVAResponse>this.vaResponse).yesNo) {
       
          this.showYesNo = true ; 
          this.isSpeaking = true;
          this.waitingHandler =  setTimeout(() => {
            this.isSpeaking = false;
            this.showYesNo = false ;
          }, 5000)
        } else { 
          this.vaResponse = null ; 
        }

      })
    })

    // init speach recognition with continuouse and inerResult option 
    // and frensh langugae
    var speechRecognition = window.SpeechRecognition || (<any>window).webkitSpeechRecognition;
    this.recognition = new speechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'fr-FR';

    this.recognition.onresult = (event) => {

      this.zone.run(() => {
        this.command = "";

        for (var i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {

            this.command = event.results[i][0].transcript;

            this.recognition.stop();

            this.isRecording = false;
            this.vaResponse = null;

            this.virtualAssistantService.execute(this.command);
        
          } else {
            this.command += event.results[i][0].transcript;
          }
        }
      })
    }
  }

  public yes() {
    if (this.waitingHandler) { 
      clearInterval(this.waitingHandler) 
    }
    this.isSpeaking = false; 
    this.showYesNo = false ;  
    this.virtualAssistantService.execute(
      (<YesNoVAResponse>this.vaResponse).command
    );
    this.vaResponse = null ; 

  }

  public no() {
    if (this.waitingHandler) { 
      clearInterval(this.waitingHandler) 
    }
    this.isSpeaking = false;
    this.showYesNo = false ; 
    this.vaResponse = null ; 
  }


  private speak(vaResponse: VAResponse) {
    // buil speak function as promise to know exactly where the VA end speaking
    return new Promise((resolve, reject) => {
      // set the va response to the givven response
      // and the text to the givel vaResponse message
      this.vaResponse = vaResponse;
      this.toSpeech.text = this.vaResponse.message;

      var speaking = true;
      // icheck the speakable attribute of the VAResponse if it's once 
      // check if it's allready existe in the once table 
      // if it's random generat a random number between 0 - 1 
      // if it's always the speak it
      if (this.vaResponse.speakable == ONCE) {
        var index = this.onceVaResponses.findIndex(
          value =>
            value.message == this.vaResponse.message &&
            value.speakable == this.vaResponse.speakable
        );
        if (index < 0)
          this.onceVaResponses.push(this.vaResponse);
        speaking = index < 0;

      }

      if (this.vaResponse.speakable == RANDOM) {
        var proba = Math.trunc(Math.random() * 10) % 2;
        speaking = proba == 1;
      }
      // if speaking it true 
      // speak the message and wwait for it to done 
      if (speaking) {
        this.isSpeaking = true;
        this.tts.speak(this.toSpeech);

        this.toSpeech.onend = () => {
          this.isSpeaking = false;
          resolve(null)
        }
      } else {
        resolve(null)
      }
    })
  }


  public async listen() {

    this.command = "";
    // the VA is speaking don't inturept 
    if (this.isSpeaking) {
      this.isSpeaking = false;
      this.vaResponse = null;
      return;
    }
    // if it's recording stop recording and return 
    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
      this.vaResponse = null;
      return;
    }

    // ther is no va respose in this case create a welcoming message
    if (this.vaResponse == null) {
      this.vaResponse = this.getWelcominMessage();
    }
    // speak what ever the message is
    await this.speak(this.vaResponse);
    this.isRecording = true;
    // start recording 
    this.recognition.start();
  }
}
