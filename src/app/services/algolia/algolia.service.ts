import { Injectable } from '@angular/core';
import algoliasearch from 'algoliasearch';

export const searchClient = algoliasearch(
  'PUHWMMO4OB',
  '4e0ac3250e700a67988c73982072fbdb'
);


@Injectable({
  providedIn: 'root'
})
export class AlgoliaService {
  actualUserId: string;
  constructor() {
    if(localStorage.getItem("user") !== null) this.actualUserId = JSON.parse(localStorage.getItem("user")).id;
   }

  async setOnLocalStorageFromDB(dbname: string, dataname: string, filter: string){
    
    var initDB = searchClient.initIndex(dbname);
    
    await initDB.browse('', {
      filters: filter
    }).then(function(res){
      var data = res.hits;
      localStorage.setItem(dataname, JSON.stringify(data));
    });
  }
  async getItemById(itemId: string){
    let data;
    await this.setOnLocalStorageFromDB("items", "tmpItem", "objectID:"+itemId);
    data = JSON.parse(localStorage.getItem("tmpItem"));
    localStorage.removeItem('tmpItem');
    return data[0];
  }
  async getUserItems(userId: string){
    let data;
    await this.setOnLocalStorageFromDB("items", "tmpItems", "user_id:"+userId);
    data = JSON.parse(localStorage.getItem("tmpItems"));
    localStorage.removeItem('tmpItems');
    return data;
  }
  async getReviewById(reviewId){
    let data;
    await this.setOnLocalStorageFromDB("reviews", "tmpReview", "objectID:"+reviewId);
    data = JSON.parse(localStorage.getItem("tmpReview"));
    localStorage.removeItem('tmpReview');
    return data[0];
  }
  async getSentReviews(){
    let data;
    await this.setOnLocalStorageFromDB("reviews", "tmpReviews", "from_id:"+this.actualUserId);
    data = JSON.parse(localStorage.getItem("tmpReviews"));
    localStorage.removeItem('tmpReviews');
    return data;
  }
  async getReceivedReviews(userId: string){
    let data;
    console.log(userId);
    await this.setOnLocalStorageFromDB("reviews", "tmpReviews", "to_id:"+userId);
    data = JSON.parse(localStorage.getItem("tmpReviews"));
    localStorage.removeItem('tmpReviews');
    return data;
  }
  async getMessageById(msgId: string){
    let data;
    await this.setOnLocalStorageFromDB("messages", "tmpMsg", "objectID:"+msgId);
    data = JSON.parse(localStorage.getItem("tmpMsg"));
    localStorage.removeItem('tmpMsg');
    return data[0];
  }
  async getUserById(userId: string){
    let data;
    await this.setOnLocalStorageFromDB("user-profiles", "tmpUser", "objectID:"+userId);
    console.log("getuser");
    data = JSON.parse(localStorage.getItem("tmpUser"));
    localStorage.removeItem('tmpUser');
    return data[0];
  } 
  async getActualUserData(){
    let data;
    await this.setOnLocalStorageFromDB("user-profiles", "tmpUser", "objectID:"+this.actualUserId);
    data = JSON.parse(localStorage.getItem("tmpUser"));
    localStorage.removeItem('tmpUser');
    return data[0];
  }
  async getNewMsgNumber(){
    let data;
   
    await this.setOnLocalStorageFromDB("messages", "tmpMessages", "to_id:"+this.actualUserId+" AND recipientDelete:0 AND opened:0"); 
    data = JSON.parse(localStorage.getItem("tmpMessages"));
   
    localStorage.removeItem('tmpMessages');
    return data.length;
  }
  async getSentMessages(){
    let data;
   
    await this.setOnLocalStorageFromDB("messages", "tmpMessages", "from_id:"+this.actualUserId+" AND senderDelete:0"); 
    data = JSON.parse(localStorage.getItem("tmpMessages"));
    localStorage.removeItem('tmpMessages');
    return data;
  }
  async getReceivedMessages(){
    let data;
    await this.setOnLocalStorageFromDB("messages", "tmpMessages", "to_id:"+this.actualUserId+" AND recipientDelete:0");
    data = JSON.parse(localStorage.getItem("tmpMessages"));
    localStorage.removeItem('tmpMessages');
    return data;
  }
  async getArchivedMessages(){
    let data;
    await this.setOnLocalStorageFromDB("messages", "tmpMessages", "to_id:"+this.actualUserId+" AND archived:1");
    data = JSON.parse(localStorage.getItem("tmpMessages"));
    localStorage.removeItem('tmpMessages');
    return data;
  }
  async getUserPoints(userId: string){
    let reviews : [] = await this.getReceivedReviews(userId);
    let totalpoints = 0;
    for (let i = 0; i < reviews.length; i++) {
      totalpoints = parseInt(reviews[i]['points']) + totalpoints;
    }
    return (totalpoints/reviews.length).toFixed(1);
    
  }
  async checkIfEmailExists(email){
    let data;
    await this.setOnLocalStorageFromDB("user-profiles", "tmpUser", "email:"+email);
    data = JSON.parse(localStorage.getItem("tmpUser"));
    localStorage.removeItem('tmpUser');
    if(data[0])
      return true;
    else
      return false;
  }
  async getReviewToUser(toID){
    let data;
    await this.setOnLocalStorageFromDB("reviews", "tmpReview", "from_id:"+this.actualUserId+" AND to_id:"+toID);
    data = JSON.parse(localStorage.getItem("tmpReview"));
    localStorage.removeItem('tmpReview');
    if(data[0])
      return data[0];
    else
      return false;
  }
async getNumberOfReviews(userId: string){
  let data = await this.getReceivedReviews(userId);

  return data.length;
  
}
async getNumberOfItems(userId: string){
  let data = await this.getUserItems(userId);

  return data.length;
  
}

}