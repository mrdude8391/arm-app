import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }

  getNumbers() {
    const numbRef = collection(this.firestore, 'numbers');
    return collectionData(numbRef);
  }
}
