import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import MapOptions from './../../classes/MapOptions';

import { AccessRightsService } from '../../services/accessRights.service';
import { SocketService } from '../../services/socket.service';

import { FilterdialogComponent } from './filterdialog/filterdialog.component';

@Component({
  selector: 'app-generalview',
  templateUrl: './generalview.component.html',
  styleUrls: ['./generalview.component.css']
})
export class GeneralviewComponent implements OnInit {
  mapOptions = new MapOptions(true, false, false, false, false, {lat: 48.864716, lng: 2.349014});
  mapdata = '{"type": "FeatureCollection", "features": []}';
  features: any[] = [];

  // TODO Use agentTypes and selectedAgentTypes.
  filterData: any = {

  };


  constructor(private socketService: SocketService,
    public dialog: MatDialog) {}

  ngOnInit() {

  }

  onMapDataChanged(mapdata: string) {
    this.mapdata = mapdata;
  }

  initializeMap() {
  }

  updateMap() {
    this.mapdata = '{"type": "FeatureCollection", "features": []}';
    this.features = [];

    this.mapdata = JSON.stringify(JSON.parse(this.mapdata).features = this.features);
  }

  openFilterDialog() {

    this.initializeMap();

    const dialogRef = this.dialog.open(FilterdialogComponent, {
      width: '70%',
      data: this.filterData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.updateMap();
      }

    });
  }

}
