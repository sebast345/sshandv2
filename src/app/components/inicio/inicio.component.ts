import { Component } from '@angular/core';
import { searchClient } from '../../services/algolia/algolia.service'


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})



export class InicioComponent {

  config = {
    indexName: 'items',
    searchClient
  };
  
  constructor() { 
    
  }

  

}



