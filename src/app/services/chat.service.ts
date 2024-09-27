import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { IChatRoom, IMessage } from '../models';
import { Firestore, collection, getDocs, CollectionReference, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _db: Firestore = inject(Firestore);
  private roomsSubject = new BehaviorSubject<IChatRoom[]>([]);
  private messagesSubject = new BehaviorSubject<IMessage[]>([]); // BehaviorSubject for messages

  constructor() {
    this.loadRooms(); // Load rooms on initialization
  }

  private loadRooms(): void {
    const roomsCollection: CollectionReference = collection(this._db, 'rooms');

    getDocs(roomsCollection)
      .then(snapshot => {
        const rooms: IChatRoom[] = snapshot.docs.map(doc => {
          const data = doc.data() as IChatRoom;
          return { ...data, id: doc.id };
        });
        this.roomsSubject.next(rooms); // Update BehaviorSubject
      })
      .catch(error => {
        console.error('Error loading rooms:', error);
      });
  }

  public getRoom(): Observable<IChatRoom[]> {
    return this.roomsSubject.asObservable(); // Return BehaviorSubject
  }

  public getUserRooms(userId: string): Observable<IChatRoom[]> {
    return new Observable<IChatRoom[]>(observer => {
      this.loadRooms(); // Load rooms

      this.roomsSubject.asObservable().subscribe(rooms => {
        const userRooms = rooms.filter(room => room.createdUserId === userId);
        observer.next(userRooms);
      });
    });
  }

  public getRoomMessages(roomId: string): Observable<IMessage[]> {
    const roomsCollection: CollectionReference = collection(this._db, 'rooms');
    const messagesCollection: CollectionReference = collection(roomsCollection, roomId, 'messages');

    // Clear previous messages before loading new ones
    this.messagesSubject.next([]);

    return new Observable<IMessage[]>(observer => {
      getDocs(messagesCollection)
        .then(snapshot => {
          const messages: IMessage[] = snapshot.docs.map(doc => {
            const data = doc.data() as IMessage;
            return { ...data, id: doc.id }; // Add ID from Firestore
          });
          this.messagesSubject.next(messages); // Update messages
          observer.next(messages);
          observer.complete();
        })
        .catch(error => {
          console.error('Error loading messages:', error); // Log the error
          observer.error(error);
        });
    });
  }

  public addRoom(roomName: string, userId: string): void {
    const roomsCollection: CollectionReference = collection(this._db, 'rooms');
    const room = {
      roomName,
      createdUserId: userId,
    };

    // Add room to Firestore
    addDoc(roomsCollection, room)
      .then(docRef => {
        console.log('Room added successfully:', docRef.id);
        // Update room list
        this.roomsSubject.next([...this.roomsSubject.getValue(), { ...room, id: docRef.id }]);
      })
      .catch(error => {
        console.error('Error adding room:', error);
      });
  }

  public sendMessage(userId: string, roomId: string, body: string): void {
    const roomsCollection: CollectionReference = collection(this._db, 'rooms');
    const messagesCollection: CollectionReference = collection(roomsCollection, roomId, 'messages');

    const message: IMessage = {
      id: '', // ID not available until added to Firestore
      UserId: userId, // Use uppercase as in the interface
      timestamp: Date.now(), // Store timestamp as a number
      body,
    };

    addDoc(messagesCollection, message)
      .then(docRef => {
        console.log('Message sent successfully');
        // Update messages after sending
        this.messagesSubject.next([...this.messagesSubject.getValue(), { ...message, id: docRef.id }]); // Update ID
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  }

  public getMessages(): Observable<IMessage[]> {
    return this.messagesSubject.asObservable(); // Return messages
  }
}
