import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChatRoom } from '../models';
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
}
