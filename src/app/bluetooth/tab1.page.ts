import { ConnectionStatusComponent } from './connection-status/connection-status.component';
import { BleDevice } from './../services/bleDevice';
import { Component, NgZone } from '@angular/core';
import { BleService } from '../services/ble.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  bleDevice: BleDevice = {
    name: '',
    id: '',
    advertising: new ArrayBuffer(1),
    adData: [],
    rssi: 0,
    services: [],
    characteristics: [],
  }

  public devices: BleDevice[] = [];

  constructor(private ngZone: NgZone, public bleService: BleService) {}

  ngOnInit(): void {
    
  }

  scan(): void {
    this.bleService.getDevices()
  }

  clear(): void {
    this.devices = [];
  }

  connect(device: BleDevice): void {
    this.bleService.connectBluetooth(device);
    //this.getBleDevice();
  }

  getBleDevice(): void {
    this.bleDevice = this.bleService.currentDevice;
  }
}
