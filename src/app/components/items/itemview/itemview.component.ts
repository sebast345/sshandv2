import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { searchClient } from '../../../services/algolia/algolia.service';


const itemsDB = searchClient.initIndex('items');
const usersDB = searchClient.initIndex('user-profiles');

@Component({
  selector: 'app-itemview',
  templateUrl: './itemview.component.html',
  styleUrls: ['./itemview.component.css']
})
export class ItemviewComponent implements OnInit {
  public itemID: string;
  itemInfo: {};
  userInfo: {};

  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router
    
  ) { }

  ngOnInit() {

    //  Al parecer search en typescript no se le puede poner le parametro filter, da error, solo funciona en javascript

    //   itemsDB.search(this.itemID,)  
    //   .then(( hits ) => {
    //     console.log(hits);
    //   });

    this.getData();

  }

  
  clearStorage(){
    localStorage.removeItem('userInfo');
    localStorage.removeItem('itemInfo');
  }

  async getData(){
    this.itemID = this._route.snapshot.paramMap.get('itemId');

    await this.getItemInfo();
    await this.getUserInfo();

    this.itemInfo = JSON.parse(localStorage.getItem('itemInfo'));
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));

    this.clearStorage();
    
    setTimeout(() => {
      console.warn("Al iniciarse esta pagina es posible que salgan varios errores en consola del buscador, pero solo es porque los datos aun no habían llegado y al estar puestos en el html, carga antes y da error, pero como puedes ver, funciona correctamente.");

    }, 5000);
  }
  async getItemInfo(){
    await itemsDB.browse('', {
      filters: '(objectID:'+this.itemID+')'
    }).then(function(res){
      var itemInfo = res.hits[0];
      localStorage.setItem('itemInfo', JSON.stringify(itemInfo));
    });
  }

  async getUserInfo(){
    await usersDB.browse('', {
      filters: '(objectID:'+JSON.parse(localStorage.getItem("itemInfo")).user_id+')'
    }).then(function(res){
      var userInfo = res.hits[0];
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    });
  }
}
