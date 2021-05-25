import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-yes-no-message',
  templateUrl: './yes-no-message.component.html',
  styleUrls: ['./yes-no-message.component.css']
})
export class YesNoMessageComponent implements OnInit, OnDestroy {
  public message: string;
  @Output() closeEvent: EventEmitter<null>;
  public tag: string = null;
  constructor(
    private route: ActivatedRoute,
    private interactionService: InteractionService) {
    this.closeEvent = new EventEmitter<null>();
  }
  ngOnInit(): void {

    var params = this.route.snapshot.queryParams

    this.message = params["message"];
    if (params["tag"])
      this.tag = params["tag"]

  }

  submit(value: boolean) {
    if (this.tag == null)
      this.interactionService.yesOrNo.next(value);
    else
      this.interactionService.yesOrNo.next({
        tag: this.tag,
        response: value
      });

    this.closeEvent.emit();
  }

  ngOnDestroy() {
    this.interactionService.yesOrNo.next(null);
  }
}
