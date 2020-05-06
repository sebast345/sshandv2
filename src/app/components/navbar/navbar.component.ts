import { Component, OnInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, MatButtonModule } from  '@angular/material';
import $ from "jquery";



@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  show = true;

  constructor() { }

  ngOnInit() {

   
      $(document).ready(function(){
        $('#nav-icon').click(function(){
          $(this).toggleClass('open');
        });
      });
    

  }

}
