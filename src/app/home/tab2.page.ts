import { DataService } from './../services/data.service';
import { Component, NgZone } from '@angular/core';
import { BleService } from '../services/ble.service';
import { BleDevice } from './../services/bleDevice';
import { ConnectionStatusComponent } from '../bluetooth/connection-status/connection-status.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  
  bleDevice: BleDevice = {
    name: '',
    id: '',
    advertising: new ArrayBuffer(1),
    adData: [],
    rssi: 0,
    services: [],
    characteristics: [],
  }

  constructor(private ngZone: NgZone, public bleService: BleService, private dataService: DataService) {
    this.dataService.getNumbers().subscribe(
      res => {
        console.log(res)
      }
    );
  }
    
  ngOnInit(): void {
    
  }


}
