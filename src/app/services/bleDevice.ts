export interface BleDevice {
    name: string;
    id: string;
    advertising: ArrayBuffer;
    adData: string[];
    rssi: number;
    services: []
    characteristics: Characteristics[],
}

export enum ConncetionStatus {
    connected = 1,
    disconnected = 0,
}

export interface Characteristics {
    service: string,
    characteristic: string,
    properties: [],
    descriptors: Descriptors[]
}

export interface Descriptors {
    uuid: number
}