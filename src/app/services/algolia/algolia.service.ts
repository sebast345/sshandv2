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

  async setOnLocalStorageById(dbname: string, objectID: string, dataname: string){
    
    var initDB = searchClient.initIndex(dbname);
    
    await initDB.browse('', {
      filters: '(objectID:'+objectID+')'
    }).then(function(res){
      var data = res.hits[0];
      localStorage.setItem(dataname, JSON.stringify(data));
    });
  }


}