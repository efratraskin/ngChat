import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IChatRoom } from '../models';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Firebase module

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _db: AngularFirestore) { }

  public getRoom(): Observable<Array<IChatRoom>> {
    return this._db
      .collection('rooms')
      .snapshotChanges()
      .pipe(
        map((snaps) => {
          return snaps.map((snap) => {
            const id = snap.payload.doc.id;
            const data = snap.payload.doc.data() as IChatRoom; // הקצאה ישירה
            return { ...data, id }; // שילוב ה-ID
          });
        })
      );
  }
}
