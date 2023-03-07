import { OnLoadOptions } from './../../../node_modules/esbuild/lib/main.d';
import { clear } from './../../../node_modules/sisteransi/src/sisteransi.d';
import { Injectable, NgZone } from '@angular/core';
import { BleDevice, ConncetionStatus, Characteristics, Descriptors } from './bleDevice';
import { BLEDEVICE } from './mock-bleDevice';
import { BLE } from '@ionic-native/ble';
import { filter, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class BleService {

  status = ConncetionStatus.disconnected;
  
  currentDevice: BleDevice = {
    name : '',
    id : '',
    advertising : new ArrayBuffer(50),
    adData: [],
    rssi : 0,
    services: [],
    characteristics: [],

  }
  BATTERY_SERVICE_UUID = '180f';
  BATTERY_LEVEL_UUID = '2a19';
  charData: string = '';

  devices: BleDevice[] = [];

  constructor(private ngZone: NgZone) { }

  
  getDevices() {
    console.log("scan for devices");
    console.log("the current device is " + this.currentDevice.name);
    this.devices = [];
    BLE.startScan([]).pipe(
      filter(device => device.name != null)
    )
    .subscribe((device) => {
      
      var adData = new Uint8Array(device.advertising);
      
      console.log("advertising Data " ,adData.toString());
      var strDat8 = new TextDecoder('utf-8').decode(adData);
      var strDat = adData.toString();
      console.log("decoded Data " ,strDat8);
      console.log("string Data " ,strDat);
      this.ngZone.run(() => {
        
        console.log(JSON.stringify(device));
        this.devices.push(device);
      });
    });
  }

  connectBluetooth(device: BleDevice){
    console.log("connecting to device " + device.name);
    BLE.autoConnect(device.id, this.onConnected.bind(this), this.onDisconnected.bind(this));
  }

  onConnected(device: BleDevice){
    console.log("Connected to " + device.name);
    console.log(this.currentDevice.name);

    BLE.read(device.id, "180F", "2A19").then((data) => {
      console.log("read data", data);
      let buf = new Uint8Array(data);
      console.log("buf data", buf);
      console.log("buf read", buf[0]);
      this.ngZone.run(() => {
        this.charData = buf[0].toString();
      });
    })

    this.ngZone.run(() => {
      this.currentDevice.name = device.name;
      this.currentDevice.id = device.id;
      this.currentDevice.advertising = device.advertising;
      this.currentDevice.rssi = device.rssi;
      this.currentDevice.services = device.services;
      this.currentDevice.characteristics = device.characteristics;
    })
    console.log("set current device to " + device.name);
    this.getData(device);
  }

  //bruh

  onDisconnected(device: BleDevice){
    console.log("Disconnected from" + device.name);
    this.ngZone.run(() => {
      this.currentDevice.name = '';
      this.currentDevice.id = '';
      this.currentDevice.advertising = new ArrayBuffer(1);
      this.currentDevice.rssi = 0;
    });
  }

 bytesToString(buffer: ArrayBuffer) {
    return String.fromCharCode.apply(null, [...new Uint8Array(buffer)]);
  }

  getData(device: BleDevice){
    console.log("get data method");
    BLE.startNotification(device.id, "180F", "2A19").subscribe((buffer) => {
      console.log("buffer", buffer);
      let data = new Uint8Array(buffer[0]);
      console.log("data", data);
      console.log("data", data[0]);
      this.ngZone.run(() => {
        this.charData = data[0].toString();
      }      
      );
      },
      error => {
        console.error('Error subscribing to battery level notifications:', error);
      });
  }

  updateCurrentDevice(device: BleDevice){
    this.currentDevice.name = device.name;
    this.currentDevice.id = device.id;
    this.currentDevice.advertising = device.advertising;
    this.currentDevice.rssi = device.rssi;
  }

  getBleDevice() : BleDevice {
    return this.currentDevice; 
  } 


  discoverBatteryService() {
    BLE.scan([this.BATTERY_SERVICE_UUID], 5).subscribe(
      device => {
        // Device found with the battery service UUID
        console.log('Found battery service device:', JSON.stringify(device));
  
        // Connect to the device
        BLE.connect(device.id).subscribe(
          connectedDevice => {
            // Device connected
            console.log('Connected to device:', JSON.stringify(connectedDevice));
            BLE.startNotification(connectedDevice.id, this.BATTERY_SERVICE_UUID, this.BATTERY_LEVEL_UUID).subscribe(
                  data => {
                    // Battery level data received
                    console.log('Battery level data received:', new Uint8Array(data));
                    var str = String.fromCharCode.apply(null, [...new Uint8Array(data)])
                    this.ngZone.run(() => {
                      const buffer = new Uint8Array(data).buffer;
                      console.log("buffer", buffer)
                      
                      const uint8array = [...new Uint8Array(data)]; // create a new typed array from the buffer
                      console.log(uint8array[0], uint8array[1], uint8array[2], uint8array[3]);
                      
                    }
                    );
                    console.log('Battery level:', str);
                    const batteryLevel = new DataView(new Uint8Array(data).buffer).getUint8(0); // Assuming the data is a single byte representing the battery level
                    console.log('Battery level:', batteryLevel);
                  },
                  error => {
                    console.error('Error subscribing to battery level notifications:', error);
                  }
                );
          },
          error => {
            console.error('Error connecting to device:', error);
          }
        );
      },
      error => {
        console.error('Error scanning for battery service device:', error);
      }
    );
  }
}
