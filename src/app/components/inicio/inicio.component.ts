import { Component } from '@angular/core';
import { searchClient } from '../../services/algolia/algolia.service'
import { Title } from '@angular/platform-browser';

export function reloadPage(){
  setTimeout(() => {
    window.location.reload();
  }, 1500);
  
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})




export class InicioComponent {

  config = {
    indexName: 'items',
    searchClient,
    routing: true
  };
  
  constructor(private titleService: Title) { 
    this.titleService.setTitle( "SShand v2, aunque no quiere decir que sea más bonita" );
  }
  

}



