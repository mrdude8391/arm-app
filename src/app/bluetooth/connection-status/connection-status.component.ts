import { BleDevice } from '../../services/bleDevice';
import { Component,  Input } from '@angular/core';
import { BleService } from '../../services/ble.service';

@Component({
  selector: 'app-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss'],
})
export class ConnectionStatusComponent {

  

  @Input() device?: BleDevice;

}
