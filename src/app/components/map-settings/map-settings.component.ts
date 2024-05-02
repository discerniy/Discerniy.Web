import { Component, Input } from '@angular/core';
import * as L from 'leaflet';
import { Group } from 'src/app/models/data/Group';
import { MapSector } from 'src/app/models/data/MapSector';
import { GroupApiService } from 'src/app/services/group-api.service';

@Component({
  selector: 'app-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.css']
})
export class MapSettingsComponent {

  @Input({ required: true })
  public map!: L.Map;

  @Input({ required: true })
  public meLocation!: L.Marker;

  @Input({ required: true })
  public config: MapProperties = {} as MapProperties;
  @Input({ required: true })
  public set init(value: boolean) {
    if (value) {
      this.onInit();
    }
  }

  isOpenGroupList = false;
  groups: GroupListItem[] = [];

  constructor(private groupService: GroupApiService) { 
  }

  onInit(): void {
    this.map.addEventListener('move', (e: L.LeafletEvent) => {
      this.config.subscribeToMeLocation = false;
    });
    this.groupService.getMyGroups().then(groups => {
      this.groups = groups.map(group => {
        const item = {
          item: group,
          checked: localStorage.getItem(`group-${group.id}-isShown`) === 'true',
          sector: new MapSector(this.map)
        };
        item.sector.visible = item.checked;
        item.sector.name = group.name;
        item.sector.addPoints(group.responsibilityArea.map(p => ({ lat: p.northing, lng: p.easting })));
        return item;
      });
    });
  }

  toggleGroupList() {
    this.isOpenGroupList = !this.isOpenGroupList;
  }

  public toggleSubscribeToMeLocation() {
    this.config.subscribeToMeLocation = !this.config.subscribeToMeLocation;
    if (this.config.subscribeToMeLocation) {
      let zoom = this.map.getZoom();
      this.map.setView(this.meLocation.getLatLng(), zoom);
    }
  }

  public toggleGroup(group: GroupListItem) {
    group.checked = !group.checked;
    localStorage.setItem(`group-${group.item.id}-isShown`, group.checked.toString());
    group.sector.visible = group.checked;
  }
}

export type MapProperties = {
  subscribeToMeLocation: boolean;
};

type GroupListItem = {
  item: Group;
  checked: boolean;
  sector: MapSector;
};