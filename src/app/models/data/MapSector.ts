import { EventEmitter } from '@angular/core';
import * as L from 'leaflet';

export class MapSector {

    private map: L.Map;

    public id: string = '';
    public name: string = '';
    public supportEdit: boolean = false;

    public onInside: EventEmitter<boolean> = new EventEmitter<boolean>();

    public points: MapSectorPoint[] = [];
    private get selectedPoint() {
        return this.points.find(p => p.selected);
    }
    private addMarker: L.Marker;
    public get hasSelectedPoint() {
        return this.selectedPoint != undefined;
    }
    public polygon: L.Polygon | null = null;

    constructor(map: L.Map) {
        this.map = map;
        document.addEventListener('keydown', (e: KeyboardEvent) => this.handleKeyDown(e));
        this.map.addEventListener('mousemove', (e: L.LeafletMouseEvent) => this.handleMouseMove(e));
        this.addMarker = L.marker([0, 0], {
            icon: L.icon({
                iconUrl: 'assets/icons/add.png',
                iconSize: [16, 16],
                className: 'polygon-point-icon'
            })
        });
    }

    public setMap(map: L.Map) {
        this.map = map;
    }

    public getSelectedPoint() {
        return this.selectedPoint;
    }

    public addPoint(point: MapSectorPoint) {
        this.points.push(point);

        point.marker.addTo(this.map);
        point.marker.addEventListener('click', (e: L.LeafletMouseEvent) => {
            if (this.selectedPoint?.id === point.id) {
                point.selected = !point.selected;
                return;
            }
            if (this.selectedPoint !== undefined) {
                this.selectedPoint.selected = false;
            }
            point.selected = true;
        });

        if (this.polygon) {
            this.polygon.addLatLng([point.lat, point.lng]);
        } else {
            this.polygon = L.polygon([[point.lat, point.lng]]);
            this.polygon.addTo(this.map);
        }
    }

    public removePoint(point: MapSectorPoint) {
        let index = this.points.indexOf(point);
        if (index >= 0) {
            this.points.splice(index, 1);
            if (this.polygon) {
                this.polygon.setLatLngs(this.points.map(p => [p.lat, p.lng]));
            }
        }
    }

    public popPoint() {
        if (this.points.length > 0) {
            let point = this.points.pop();
            if (point) {
                point.marker.remove();
            }
            if (this.polygon) {
                this.polygon.setLatLngs(this.points.map(p => [p.lat, p.lng]));
            }
            return point;
        }
        return null;
    }

    public clear() {
        this.points = [];
        if (this.polygon) {
            this.polygon.remove();
            this.polygon = null;
        }
    }

    public handleMapClick(e: L.LeafletMouseEvent) {
        if (!this.supportEdit) {
            return;
        }

        if (this.selectedPoint != undefined) {
            this.selectedPoint.marker.setLatLng(e.latlng);
            this.selectedPoint.lat = e.latlng.lat;
            this.selectedPoint.lng = e.latlng.lng;
            if (this.polygon) {
                this.polygon.setLatLngs(this.points.map(p => [p.lat, p.lng]));
                console.log('polygon updated', this.polygon.getLatLngs());
            }
            this.selectedPoint.selected = false;
        }
    }

    private handleKeyDown(e: KeyboardEvent) {
        if (!this.supportEdit) {
            return;
        }
        if (this.selectedPoint == undefined) {
            return;
        }

        let speed = 0.0001;
        if(e.shiftKey) {
            speed = 0.001;
        }
        if(e.ctrlKey) {
            speed = 0.00001;
        }

        // arrow up
        if (e.code === 'ArrowUp') {
            this.selectedPoint.lat += speed;
            this.selectedPoint.marker.setLatLng([this.selectedPoint.lat, this.selectedPoint.lng]);
            if (this.polygon) {
                this.polygon.setLatLngs(this.points.map(p => [p.lat, p.lng]));
            }
        }

        // arrow down
        if (e.code === 'ArrowDown') {
            this.selectedPoint.lat -= speed;
            this.selectedPoint.marker.setLatLng([this.selectedPoint.lat, this.selectedPoint.lng]);
            if (this.polygon) {
                this.polygon.setLatLngs(this.points.map(p => [p.lat, p.lng]));
            }
        }

        // arrow left
        if (e.code === 'ArrowLeft') {
            this.selectedPoint.lng -= speed;
            this.selectedPoint.marker.setLatLng([this.selectedPoint.lat, this.selectedPoint.lng]);
            if (this.polygon) {
                this.polygon.setLatLngs(this.points.map(p => [p.lat, p.lng]));
            }
        }

        // arrow right
        if (e.code === 'ArrowRight') {
            this.selectedPoint.lng += speed;
            this.selectedPoint.marker.setLatLng([this.selectedPoint.lat, this.selectedPoint.lng]);
            if (this.polygon) {
                this.polygon.setLatLngs(this.points.map(p => [p.lat, p.lng]));
            }
        }
    }

    private handleMouseMove(e: L.LeafletMouseEvent) {
        if (this.polygon) {
            let latlng = e.latlng;
            let inside = false;
            let x = latlng.lat, y = latlng.lng;
            let vs: L.LatLng[] = this.polygon.getLatLngs()[0] as L.LatLng[];

            vs.forEach((v, i) => {
                let j = (i + 1) % vs.length;
                if (((vs[i].lng > y) != (vs[j].lng > y)) &&
                    (x < (vs[j].lat - vs[i].lat) * (y - vs[i].lng) / (vs[j].lng - vs[i].lng) + vs[i].lat)) {
                    inside = !inside;
                }
            });
            this.onInside.emit(inside);

            // show add button on the center of the closest edge
            let minDistance = Number.MAX_VALUE;
            let closestPoint: L.Point | null = null;

            let iPoint = this.map.latLngToLayerPoint(vs[0]);
            let jPoint = this.map.latLngToLayerPoint(vs[1]);

            vs.forEach((v, i) => {
                let j = (i + 1) % vs.length;
                iPoint = this.map.latLngToLayerPoint(vs[i]);
                jPoint = this.map.latLngToLayerPoint(vs[j]);
                let distance = L.LineUtil.pointToSegmentDistance(e.layerPoint, iPoint, jPoint);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = L.LineUtil.closestPointOnSegment(e.layerPoint, iPoint, jPoint);
                }
            });

            if (closestPoint != null) {
                let latlng = this.map.layerPointToLatLng(closestPoint);

                this.addMarker.setLatLng(latlng);
                this.addMarker.addTo(this.map);
            }
        }
    }
}

export class MapSectorPoint {
    private _selected: boolean = false;

    public id: string;
    public lat: number;
    public lng: number;

    public marker: L.Marker;

    public get selected() {
        return this._selected;
    }

    public set selected(value: boolean) {
        this._selected = value;
        if (value) {
            this.marker.getElement()?.classList.add('selected');
        } else {
            this.marker.getElement()?.classList.remove('selected');
        }
    }

    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
        this.id = `polygon-point_${lat},${lng}`;
        this.marker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: 'assets/icons/point.png',
                iconSize: [16, 16],
                className: 'polygon-point-icon'
            })
        });
    }
}