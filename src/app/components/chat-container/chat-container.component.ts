import { Component,OnDestroy,OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { filter, Observable, Subscription } from 'rxjs';
import { IChatRoom, IMessage } from '../../models';
import { RoomListComponent } from '../room-list/room-list.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { ChatComponent } from "../chat/chat.component";
@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [RoomListComponent, CommonModule, RouterModule, ChatComponent],
  templateUrl: './chat-container.component.html',
  styleUrl: './chat-container.component.css'
})
export class ChatContainerComponent implements OnInit,OnDestroy{
  private subscription :Subscription=new Subscription;
  public rooms$:Observable<Array<IChatRoom>> | undefined;
  public massages$:Observable<Array<IMessage>> | undefined;

    constructor(private chatService: ChatService, private router: Router, activatedRouter: ActivatedRoute) {
      // קבלת מזהה החדר מה-URL, אם קיים
      const roomId: string = activatedRouter.snapshot.url.length > 1 ? activatedRouter.snapshot.url[1].path : '';
    
      // קבלת רשימת החדרים
      this.rooms$ = this.chatService.getRoom();
    
      // אם יש מזהה חדר, קבלת ההודעות של החדר
      if (roomId) {
        this.massages$ = this.chatService.getRoomMessages(roomId);
      } else {
        this.massages$ = new Observable(); // אם אין חדר, לא להחזיר הודעות
      }
    
      // מנוי לאירועים של נווט (router events)
      this.subscription.add(
        this.router.events.pipe(filter((data) => data instanceof NavigationEnd))
          .subscribe(() => {
            const roomIdFromUrl = activatedRouter.snapshot.url.length > 2 ? activatedRouter.snapshot.url[2].path : '';
            
            // אם יש מזהה חדר ב-URL, קבלת ההודעות של החדר המתאים
            if (roomIdFromUrl) {
              this.massages$ = this.chatService.getRoomMessages(roomIdFromUrl);
            }
          })
      );
    }
    
  ngOnDestroy(): void {
   this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    
  }

}
