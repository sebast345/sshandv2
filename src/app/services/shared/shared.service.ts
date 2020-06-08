import { Injectable } from '@angular/core';
import countriesAndStates from '../../json/countries-and-states.json';
import { NotLoggedDialogComponent } from '../../components/dialogs/not-logged-dialog/not-logged-dialog.component';
import { CantEditComponent } from '../../components/dialogs/cant-edit/cant-edit/cant-edit.component';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { DeleteForSureComponent } from 'src/app/components/dialogs/delete-for-sure/delete-for-sure/delete-for-sure.component';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    public dialog: MatDialog) { }

  public setStatesListener(){
    setTimeout(() => {
      let stateLabel = document.getElementById("stateLabel");
      let countrySel = <HTMLSelectElement>document.getElementById("countrySel");
      if(!countrySel)
        this.setStatesListener();
      let stateSel = <HTMLSelectElement>document.getElementById("stateSel");
      //Cambiar las ciudades en cuanto cambie de pais el Select
      countrySel.addEventListener("change",() => {
          if(countrySel.value == "Alguna parte"){
            stateSel.length = 0;
            stateSel.options[stateSel.options.length] = new Option("--Selecciona provincia--", "Algún sitio");
            stateLabel.style.display = "none";
            return;
          }
            
          for (var i = 0; i < countriesAndStates['countries'].length; i++) {
            if(countriesAndStates['countries'][i].country == countrySel.value) var country = i;
          }
          stateSel.length = 0; // Primero quitar todas las opciones actuales
    
          if (countrySel.selectedIndex < 1)
              return; // done
    
          var states = countriesAndStates['countries'][country].states;
          
          if(states.length == 0)
            stateSel.options[stateSel.options.length] = new Option(countrySel.value, countrySel.value);
          else
            for (var j = 0; j < states.length; j++) {
                stateSel.options[stateSel.options.length] = new Option(states[j], states[j]);
            }
            stateLabel.style.display = "block";
 
      })
    }, 200);
   }

   openNotLoggedDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;


    this.dialog.open(NotLoggedDialogComponent, dialogConfig);
  }
  openCantEditDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;


    this.dialog.open(CantEditComponent, dialogConfig);
  }
  openDeleteForSureDialog(id){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: id,
    }


    this.dialog.open(DeleteForSureComponent, dialogConfig);
  }
}
