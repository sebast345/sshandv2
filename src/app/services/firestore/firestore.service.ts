import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../models/user/user.model';
import { Item } from '../../models/item/item.model';
import { Message } from '../../models/message/message.model';
import { Review } from '../../models/review/review.model';
import { AlgoliaService } from '../algolia/algolia.service';

const ESmonths = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
]

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(public firestore: AngularFirestore, private algolia: AlgoliaService) {
   }

  getUsers() {
    return this.firestore.collection('user-profiles').snapshotChanges();
  }
  createUser(user: User){
    console.log(user);
    this.firestore.collection('user-profiles').add(user);
    console.log(user); 
  }
  updateUser(userID, user: User){
    this.firestore.doc('user-profiles/' + userID).update(user);
  }
  
  updateItem(item: Item){
    let itemId= item.objectID
    delete item.objectID;
    this.firestore.doc('items/' + itemId).update(this.setTimestampDate(item));
    
  }
  postItem(item: Item){
    item.user_name = JSON.parse(localStorage.getItem("user")).name;
    item.user_id = JSON.parse(localStorage.getItem("user")).id;
    
    this.firestore.collection('items').add(this.setTimestampDate(item));
  }
  async sendMsg(msg: Message){

    await this.getIdByEmailAndDo(msg.to_email, function(res){
      msg.to_id = res.id
      msg.to_name = res.data().name
      msg.from_id = JSON.parse(localStorage.getItem("user")).id;
      msg.from_name = JSON.parse(localStorage.getItem("user")).name;
      localStorage.setItem('tmpMsg', JSON.stringify(msg));
    });

    var messageToSend = JSON.parse(localStorage.getItem('tmpMsg'));
    this.firestore.collection('messages').add(this.setTimestampDate(messageToSend));
    localStorage.removeItem('tmpMsg');
    
  }
  updateMsg(msg: Message){
    this.firestore.doc('messages/' + msg.objectID).update(msg);
  
  } 
  deleteItem(itemId){
    this.firestore.collection('items').doc(itemId).delete();
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
  openMsg(msgId){
    let msg: any = {};
    msg.opened = 1;
    this.firestore.collection('messages').doc(msgId).update(msg);
  }
  
  async sendReview(review: Review){
    if(await this.algolia.getReviewToUser(review.to_id)){
      let reviewId = review.objectID;
      console.log(this.algolia.getReviewToUser(review.to_id));
      delete review.objectID;
      review.edited = true;
      this.firestore.collection('reviews').doc(reviewId).update(this.setTimestampDate(review)); 
    }
    else{
      review.from_id = JSON.parse(localStorage.getItem("user")).id;
      review.edited = false;
      this.firestore.collection('reviews').add(this.setTimestampDate(review));
    }
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
    console.log(photo);
    this.firestore.collection("user-profiles").doc(JSON.parse(localStorage.getItem("user")).id).update(photo);
  }
  private setTimestampDate(value){
    var today = new Date();
    var date = today.getDate()+' de '+ESmonths[(today.getMonth())];
    var time = today.getHours() + ":" + today.getMinutes();
    var dateTime = date+' '+time;
    value.timestamp = Math.floor(Date.now());
    value.date = dateTime;

    return value;
  }
}
