import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../models/user/user.model';
import { Item } from '../../models/item/item.model';
import { Message } from '../../models/message/message.model';
import { Review } from '../../models/review/review.model';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public firestore: AngularFirestore) {
   }

  getUsers() {
    return this.firestore.collection('user-profiles').snapshotChanges();
  }
  getUserByID(userID: string){
    return this.firestore.doc('user-profiles/' + userID).snapshotChanges();
  }
  createUser(user: User){
    this.firestore.collection('user-profiles').add(user);
  }
  updateUser(userID, user: User){
    this.firestore.doc('user-profiles/' + userID).update(user);
  }
  getItems(){
    return this.firestore.collection('items').snapshotChanges();
  }
  getItemByID(itemID: string){
    return this.firestore.doc('user-profiles/' + itemID).snapshotChanges();
  }
  updateItem(item: Item){
      this.firestore.doc('user-profiles/' + item.objectId).update(item);
    
  }
  postItem(item: Item){
    item.user_id = JSON.parse(localStorage.getItem("user")).id;
    this.firestore.collection('items').add(item);
  }
  async sendMsg(msg: Message){
    // var waitForAsync = timeoutms => new Promise((resolve, reject)=>{
    //   var check = () => {
    //     if(JSON.parse(localStorage.getItem('tmpMsg')) != null) {
    //        resolve()
    //        var messageToSend = JSON.parse(localStorage.getItem('tmpMsg'));
    //        this.firestore.collection('messages').add(messageToSend);
    //        localStorage.setItem('tmpMsg', null);
    //     }
    //     else if((timeoutms -= 100) < 0)
    //       reject('timed out!')
    //     else
    //       setTimeout(check, 100)
    //   }
    //   setTimeout(check, 100)
    // });

    await this.getIdByEmailAndDo(msg.to_id, function(id){
      msg.to_id = id
      msg.from_id = JSON.parse(localStorage.getItem("user")).id;
      localStorage.setItem('tmpMsg', JSON.stringify(msg));
    });
    // waitForAsync(100)
    var messageToSend = JSON.parse(localStorage.getItem('tmpMsg'));
    this.firestore.collection('messages').add(messageToSend);
    localStorage.setItem('tmpMsg', null);
    
  }
  updateMsg(msg: Message){
    this.firestore.doc('messages/' + msg.objectId).update(msg);
  
  } 
  deleteMsg(msg: Message){
    this.firestore.collection('messages').doc('messages/'+msg.objectId);
  }
  sendReview(review: Review){

    review.from_id = JSON.parse(localStorage.getItem("user")).id;
    this.firestore.collection('reviews').add(review);
    
  }
  updateReview(review: Review){
    this.firestore.doc('reviews/' + review.id).update(review);
  
  } 
  deleteReview(reviewID: string){
    this.firestore.collection('reviews').doc('reviews/'+reviewID);
  }

  async getIdByEmailAndDo(email: string, callback){
    let user_collection = this.firestore.collection("user-profiles");
    let query = user_collection.ref.where("email", "==", email).get();

    await query.then( function ( querySnapshot ) {
      querySnapshot.forEach( function ( doc ){
        callback(doc.id);
      });
    });
  }
}
