import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { IChatRoom } from '../../models';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css'
})
export class ChatContainerComponent implements OnInit{
  public rooms$:Observable<Array<IChatRoom>> | undefined;
  constructor(private chatService:ChatService){
  this.rooms$=this.chatService.getRoom();
  }
  ngOnInit(): void {
    
  }

}
