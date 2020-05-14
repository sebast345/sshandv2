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
  async getSentReviews(){
    let data;
    await this.setOnLocalStorageFromDB("reviews", "tmpReviews", "from_id:"+this.actualUserId);
    data = JSON.parse(localStorage.getItem("tmpReviews"));
    localStorage.removeItem('tmpReviews');
    return data;
  }
  async getReceivedReviews(userId: string){
    let data;
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


}