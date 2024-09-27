import { Component, EventEmitter, Input, OnInit, Output, ViewChild, viewChild } from '@angular/core';
import { IMessage } from '../../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {CdkVirtualScrollViewport, ScrollingModule} from '@angular/cdk/scrolling';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule,FormsModule,ScrollingModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'] // שימו לב שזה styleUrls ולא styleUrl
})
export class ChatComponent implements OnInit {
  @ViewChild('virtualScroll', { static: false }) virtualScroll?: CdkVirtualScrollViewport;
  @Output() messageSent: EventEmitter<string> = new EventEmitter();
 /* @Input() messages: Array<IMessage> = [];*/
  newMessage: string = ''; // הגדרת סוג משתנה
  roomId: string = '';
  messageContent: string = ''; // עבור קלט ההודעה
  messages$: Observable<IMessage[]> | undefined;
  private _messages: Array<IMessage> = [];

  @ViewChild(CdkVirtualScrollViewport) viewPort?: CdkVirtualScrollViewport;

  @Output() onSendMessage: EventEmitter<string> = new EventEmitter();

  @Input() set messages(messages: Array<IMessage>) {
    this._messages = messages.sort((x, y) => {
      return x.timestamp - y.timestamp;
    });
    if (this.viewPort) {
      this.viewPort.scrollToIndex(
        this.messages.length * this.messages.length,
        'smooth'
      );
    }
  }
get messages(): Array<IMessage> {
    return this._messages;
  }

  constructor(private firestore: Firestore,private chatService: ChatService,private activatedRouter: ActivatedRoute) { 
    
  }
  ngAfterViewInit() {
    if (this.viewPort) {
      this.viewPort.scrollToIndex(this.messages.length * 10, 'smooth');
    }
  }
  public sendMessage(input: HTMLInputElement): void {
    const message = input.value; // קבלת הערך מתוך רכיב הקלט
    this.messageSent.emit(message);
    input.value = ''; // ריקון השדה לאחר שליחה
}

  ngOnInit(): void {
    
    this.activatedRouter.params.subscribe(params => {
      this.roomId = params['roomId'] || ''; 
      if (this.roomId) {
        this.loadMessages(this.roomId);
      }
    });
    
  }

  loadMessages(roomId: string) {
    // הלוגיקה שלך לטעינת הודעות
  }
}
