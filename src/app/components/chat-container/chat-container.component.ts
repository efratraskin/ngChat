import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { filter, Observable, Subscription } from 'rxjs';
import { IChatRoom, IMessage } from '../../models';
import { RoomListComponent } from '../room-list/room-list.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, RouterModule } from '@angular/router';
import { ChatComponent } from "../chat/chat.component";
import { MatDialog } from '@angular/material/dialog';
import { AddRoomComponent } from '../add-room/add-room.component';
import { AuthService } from '../../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import {ScrollingModule} from '@angular/cdk/scrolling';


@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [RoomListComponent, CommonModule, RouterModule, ChatComponent,ScrollingModule],
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css']
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  public rooms$: Observable<Array<IChatRoom>> | undefined;
  private roomId?: string;
  private userId: string = "";
  public messages$: BehaviorSubject<Array<IMessage>> = new BehaviorSubject<Array<IMessage>>([]);
  constructor(
    private chatService: ChatService,
    private router: Router,
    private activatedRouter: ActivatedRoute, // Use activatedRouter as a class property
    public dialog: MatDialog,
    private auth: AuthService
  ) {
    // Fetch the roomId from the URL
    this.roomId = this.activatedRouter.snapshot.paramMap.get('roomId') || '';

    this.rooms$ = this.chatService.getRoom();

    // Initial load of messages if roomId is defined
    if (this.roomId) {
      this.loadMessages(this.roomId);
    }

    this.subscription.add(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        const currentUrl = this.router.url;
        console.log('Current URL:', currentUrl); // לוג ה-URL הנוכחי
    
        const roomIdFromUrl = activatedRouter.snapshot.url.length > 1? activatedRouter.snapshot.url[1].path : '';
        console.log('Room ID from URL:', roomIdFromUrl); // לוג ה-roomId מה-URL
    
        if (roomIdFromUrl) {
          this.roomId = roomIdFromUrl; // עדכון ה-roomId
          console.log('Updated room ID:', this.roomId); // לוג ה-roomId המעודכן
          this.loadMessages(roomIdFromUrl);
        } else {
          console.log('No room ID found. Clearing messages.'); // לוג אם אין roomId
          this.messages$.next([]); // Clear messages if roomId is not available
        }
      })
    );
    
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
   
    this.subscription.add(
      this.auth.getUserDetails().pipe(filter(data => !!data)).subscribe(user => {
        this.userId = user.uid;
        this.rooms$ = this.chatService.getUserRooms(this.userId);
      })
    );

    // Tracking changes in the URL to update the room and messages
    this.subscription.add(
      this.router.events.pipe(filter((routerevent) => routerevent instanceof ActivationEnd)).subscribe((data) => {

        const routerevent=data as ActivationEnd;
        this.roomId=routerevent.snapshot.paramMap.get('roomId')||'';
        console.log(this.roomId);
      })
    );
  }

  private loadMessages(roomId: string): void {
    console.log('Loading messages for room ID:', roomId); // הוספת לוג כאן
    this.chatService.getRoomMessages(roomId).subscribe({
      next: (messages) => {
        console.log('Messages loaded:', messages);
        this.messages$.next(messages);
      },
      error: (err) => {
        console.error("Error loading messages:", err);
        this.messages$.next([]);
      }
    });
  }
  

  public openAddRoomModal(): void {
    const dialogRef = this.dialog.open(AddRoomComponent, {
      width: '250px',
      disableClose: false,
      data: { userId: this.userId }
    });

    dialogRef.afterClosed().subscribe((result: string | null) => {
      if (result) {
        this.OnAddRoom(result, this.userId);
      } else {
        console.log("No room name provided.");
      }
    });
  }

  public OnAddRoom(roomName: string, userId: string): void {
    roomName = roomName.trim();
    if (!roomName) {
      console.log("Room name cannot be empty.");
      return;
    }
    this.chatService.addRoom(roomName, userId);
  }

  public OnMessageSent(message: string): void {
    if (this.roomId && this.userId) {
      this.chatService.sendMessage(this.userId, this.roomId, message);
      
      const newMessage: IMessage = {
        id: '', // ה-ID לא זמין עד שנוסיף ל-Firebase
        UserId: this.userId,
        timestamp: Date.now(),
        body: message
      };

      // Update messages immediately
      this.messages$.next([...this.messages$.getValue(), newMessage]);
    }
  }
}
