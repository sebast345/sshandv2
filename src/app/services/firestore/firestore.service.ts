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
  createUser(user: User){
    this.firestore.collection('user-profiles').add(user);
  }
  updateUser(userID, user: User){
    this.firestore.doc('user-profiles/' + userID).update(user);
  }
  
  updateItem(item: Item){
      this.firestore.doc('user-profiles/' + item.objectId).update(item);
    
  }
  postItem(item: Item){
    item.user_id = JSON.parse(localStorage.getItem("user")).id;
    this.firestore.collection('items').add(item);
  }
  async sendMsg(msg: Message){

    await this.getIdByEmailAndDo(msg.to_id, function(res){
      msg.to_id = res.id
      msg.to_name = res.data().name
      msg.from_id = JSON.parse(localStorage.getItem("user")).id;
      msg.from_name = JSON.parse(localStorage.getItem("user")).name;
      localStorage.setItem('tmpMsg', JSON.stringify(msg));
    });

    var messageToSend = JSON.parse(localStorage.getItem('tmpMsg'));
    this.firestore.collection('messages').add(messageToSend);
    localStorage.removeItem('tmpMsg');
    
  }
  updateMsg(msg: Message){
    this.firestore.doc('messages/' + msg.objectID).update(msg);
  
  } 
  deleteMsg(msg: Message, type: string){
    let msgId= msg.objectID
    delete msg.objectID;
    switch(type){
      case "sent": msg.senderDelete = 1;break;
      case "received": msg.recipientDelete = 1;break;
      case "archived": msg.archived = 0;break;
    }
    console.log(msg);
    this.firestore.collection('messages').doc(msgId).update(msg); 
  }
  archiveMsg(msg: Message){
    let msgId= msg.objectID
    delete msg.objectID;
    msg.archived = 1;
    this.firestore.collection('messages').doc(msgId).update(msg);
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
        callback(doc);
      });
    });
  }
  updateAvatar(photo){
    this.firestore.collection("user-profiles").doc(JSON.parse(localStorage.getItem("user")).id).update(photo);
  }
}
