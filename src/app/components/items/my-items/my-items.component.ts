import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-my-items',
  templateUrl: './my-items.component.html',
  styleUrls: ['./my-items.component.css']
})
export class MyItemsComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {

    this.titleService.setTitle( "Mis artículos en venta" );

  }

}
