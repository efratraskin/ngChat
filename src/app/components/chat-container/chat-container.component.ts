import { Component,OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { IChatRoom } from '../../models';
import { RoomListComponent } from '../room-list/room-list.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [RoomListComponent,CommonModule,RouterModule],
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
