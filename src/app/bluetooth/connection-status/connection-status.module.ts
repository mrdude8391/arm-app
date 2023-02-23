import { ConnectionStatusComponent } from './connection-status.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    
  ],
  declarations: [ConnectionStatusComponent],
  exports: [ConnectionStatusComponent],

})
export class ConnectionStatusModule {}
