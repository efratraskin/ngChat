import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChatRoom, IMessage } from '../models';
import { map } from 'rxjs/operators';
import { Firestore, collection, getDocs, CollectionReference } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _db: Firestore = inject(Firestore);

  constructor() {}

  public getRoom(): Observable<Array<IChatRoom>> {
    const roomsCollection: CollectionReference = collection(this._db, 'rooms');

    return new Observable<Array<IChatRoom>>(observer => {
      getDocs(roomsCollection)
        .then(snapshot => {
          const rooms: IChatRoom[] = snapshot.docs.map(doc => {
            const data = doc.data() as IChatRoom;
            return { ...data, id: doc.id };
          });
          observer.next(rooms);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
  
  public getRoomMessages(roomId: string): Observable<Array<IMessage>> {
    const roomsCollection: CollectionReference = collection(this._db, 'rooms');
    const messagesCollection: CollectionReference = collection(roomsCollection, roomId, 'messages');
  
    return new Observable<Array<IMessage>>(observer => {
      getDocs(messagesCollection)
        .then(snapshot => {
          const messages: IMessage[] = snapshot.docs.map(doc => {
            const data = doc.data() as IMessage;
            return { ...data, id: doc.id };
          });
          observer.next(messages);
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
  
}
