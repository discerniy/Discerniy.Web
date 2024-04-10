import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map
  markers: L.Marker[] = [
    L.marker([31.9539, 35.9106]), // Amman
    L.marker([32.5568, 35.8469]) // Irbid
  ];

  circles: L.Circle[] = [
    L.circle([31.9539, 35.9106], { radius: 10000, color: '#ffaa11' }), // Amman
    L.circle([32.5568, 35.8469], { radius: 10000 }) // Irbid
  ];

  polygons: L.Polygon[] = [
    L.polygon([
      [31.9539, 36.9106],
      [32.5568, 36.8469],
      [31.9539, 35.9106]
    ])
  ];

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initializeMap();
    this.addMarkers();
    this.centerMap();
  }


  private initializeMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    this.map = L.map('map');
    L.tileLayer(baseMapURl).addTo(this.map);
    this.map.zoomControl.setPosition('bottomright');
    this.map.setMinZoom(3);
  }


  private addMarkers() {
    // Add your markers to the map
    this.markers.forEach(marker => marker.addTo(this.map));
    this.circles.forEach(circle => circle.addTo(this.map));
    this.polygons.forEach(polygon => polygon.addTo(this.map));
  }

  private centerMap() {
    // Create a LatLngBounds object to encompass all the marker locations
    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
    
    // Fit the map view to the bounds
    this.map.fitBounds(bounds);
  }
}
