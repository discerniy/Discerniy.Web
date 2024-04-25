import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { MapSector, MapSectorPoint } from 'src/app/models/data/MapSector';
import { SignalRService } from 'src/app/services/signal-r.service';

type Marker = { [key: string]: L.Marker };

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private debug = {
    enabled: false,
    coords: {
      lat: 0,
      lng: 0
    }
  };

  public confirmBox = {
    visible: false,
    title: 'map.confirmBox.title',
    message: 'map.confirmBox.message',
    onConfirm: () => {
      this.confirmBox.visible = false;
    },
    onCancel: () => {
      this.confirmBox.visible = false;
    }
  }

  private init: boolean = false;
  private map!: L.Map
  public mode: 'select' | 'view' = 'view';
  public type: 'area' | 'point' = 'point';
  public meLocation: L.Marker = L.marker([0, 0], {
    icon: L.icon({
      iconUrl: 'assets/icons/navigation-48.png',
      iconSize: [18, 18],
      className: 'me-location-icon'
    })
  });
  public compass: number = 0;
  public subscribeToMeLocation: boolean = false;

  markers: Marker = {};

  newSector!: MapSector;

  constructor(private route: ActivatedRoute, private signalR: SignalRService) {
    this.route.queryParams.subscribe(params => {
      let mode = params['mode'];
      if (mode === 'select') {
        this.mode = 'select';
        this.confirmBox.visible = true;
      }
      let type = params['type'];
      if (type === 'area') {
        this.type = 'area';
      }

      let debug = params['debug'];
      if (debug === 'true') {
        this.debug.enabled = true;
        this.debug.coords.lat = params['lat'] || 50;
        this.debug.coords.lng = params['lng'] || 36;
      }
    });
  }

  ngOnInit() {
  }

  async ngAfterViewInit() {
    this.signalR.connect();
    while (!this.signalR.isConnected) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.signalR.on('NearClients', this.handleNearClients.bind(this));

    setInterval(() => {
      this.signalR.updateLocation({
        easting: this.meLocation.getLatLng().lng || 0,
        northing: this.meLocation.getLatLng().lat || 0,
        compass: this.compass || 0
      })?.catch(err => console.error(err));
    }, 1000);

    this.initializeMap();
    this.getMeLocation();
    this.centerMap();
    this.map.addEventListener('click', this.handleMouseClick.bind(this));
    this.map.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.map.addEventListener('move', (e: L.LeafletEvent) => {
      this.subscribeToMeLocation = false;
    });
  }

  public toggleSubscribeToMeLocation() {
    this.subscribeToMeLocation = !this.subscribeToMeLocation;
    if (this.subscribeToMeLocation) {
      let zoom = this.map.getZoom();
      this.map.setView(this.meLocation.getLatLng(), zoom);
    }
  }

  @HostListener('window:deviceorientationabsolute', ['$event'])
  onDeviceOrientation(event: DeviceOrientationEvent) {
    if (event.alpha !== null) {
      this.compass = Math.abs(event.alpha - 360);
      if (this.compass !== null) {
        let element = this.meLocation.getElement();
        if (element) {
          let parts = element.style.transform.match(/translate3d\(([\d-]+)px, ([\d-]+)px, ([\d-]+)px\)/);
          element.style.transform = `${parts?.[0]} rotate(${this.compass}deg) translate(-50%, -50%)`;
        }
      }
    }
  }

  private initializeMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('map');
    L.tileLayer(baseMapURl).addTo(this.map);
    this.map.zoomControl.setPosition('bottomright');
    this.map.setMinZoom(3);

    this.newSector = new MapSector(this.map);
    this.newSector.supportEdit = true;
  }

  private centerMap() {
    this.map.setView(this.meLocation.getLatLng(), 13);
  }

  private getMeLocation() {
    this.meLocation.addTo(this.map);
    navigator.geolocation.watchPosition((position) => {
      let latitude = this.debug.enabled ? this.debug.coords.lat : position.coords.latitude;
      let longitude = this.debug.enabled ? this.debug.coords.lng : position.coords.longitude;

      this.meLocation.setLatLng([latitude, longitude]);

      if (this.subscribeToMeLocation || this.init === false) {
        let zoom = this.map.getZoom();
        this.map.setView(this.meLocation.getLatLng(), zoom);
        this.init = true;
      }
    });
  }

  private handleNearClients(nearClients: NearClient[]) {
    nearClients.forEach(nearClient => {
      let marker = this.markers[nearClient.id];
      if (marker !== undefined) {
        marker.removeFrom(this.map);
        marker.setLatLng([nearClient.northing, nearClient.easting]);
        marker.addTo(this.map);
      } else {
        let markerNew = L.marker([nearClient.northing, nearClient.easting], {
          icon: L.icon({
            iconUrl: 'assets/icons/navigation-48.png',
            iconSize: [18, 18],
            className: 'near-client-icon'
          })
        });
        markerNew.bindPopup(`<b>${nearClient.nickname}</b><br>${nearClient.updateAt}`);
        markerNew.addTo(this.map);
        this.markers[nearClient.id] = markerNew;
      }
      // rotate marker
      let element = this.markers[nearClient.id].getElement();
      if (element) {
        let parts = element.style.transform.match(/translate3d\(([\d-]+)px, ([\d-]+)px, ([\d-]+)px\)/);
        element.style.transform = `${parts?.[0]} rotate(${nearClient.compass}deg) translate(-50%, -50%)`;
      }
    });
  }

  private handleMouseClick(e: L.LeafletMouseEvent) {
    if (this.mode === 'select') {
      if (this.type === 'point') {
        // TODO: Add point
      } else {
        if (this.newSector.hasSelectedPoint == false) {
          console.log(this.newSector.getSelectedPoint());
          this.newSector.addPoint(new MapSectorPoint(e.latlng.lat, e.latlng.lng));
        }
      }
    }
    this.newSector.handleMapClick(e);
  }

  private handleKeyDown(e: L.LeafletKeyboardEvent) {
    // Ctrl + Z
    if (e.originalEvent.ctrlKey && e.originalEvent.code === 'KeyZ') {
      if (this.type === 'area') {
        if (this.newSector !== null) {
          this.newSector.popPoint();
        }
      }
    }
  }
}

type NearClient = {
  id: string;
  nickname: string;
  updateAt: Date;
  easting: number;
  northing: number;
  compass: number;
}
