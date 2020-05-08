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

  constructor() { }

  async setOnLocalStorageFromDB(dbname: string, objectID: string, dataname: string, filter: string){
    
    var initDB = searchClient.initIndex(dbname);
    
    await initDB.browse('', {
      filters: '('+filter+':'+objectID+')'
    }).then(function(res){
      var data = res.hits;
      localStorage.setItem(dataname, JSON.stringify(data));
    });
  }
  async getSentReviews(userId: string){
    let data;
    await this.setOnLocalStorageFromDB("reviews", userId, "tmpReviews", "from_id");
    data = JSON.parse(localStorage.getItem("tmpReviews"));
    localStorage.removeItem('tmpReviews');
    return data;
  }
  async getReceivedReviews(userId: string){
    let data;
    await this.setOnLocalStorageFromDB("reviews", userId, "tmpReviews", "to_id");
    data = JSON.parse(localStorage.getItem("tmpReviews"));
    localStorage.removeItem('tmpReviews');
    return data;
  }
  async getMessageById(msgId: string){
    let data;
    await this.setOnLocalStorageFromDB("messages", msgId, "tmpMsg", "objectID");
    data = JSON.parse(localStorage.getItem("tmpMsg"));
    localStorage.removeItem('tmpMsg');
    return data[0];
  }
  async getUserById(userId: string){
    let data;
    await this.setOnLocalStorageFromDB("user-profiles", userId, "tmpUser", "objectID");
    data = JSON.parse(localStorage.getItem("tmpUser"));
    localStorage.removeItem('tmpUser');
    return data[0];
  } 


}