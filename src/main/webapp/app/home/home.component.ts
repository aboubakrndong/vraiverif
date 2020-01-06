import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { MainNavComponent } from 'app/main-nav/main-nav.component';
import { LoginModalService, AccountService, Account } from 'app/core';
import {MapMouseEvent, Map, Layer} from 'mapbox-gl';


@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
  earthquakes: object;
  earthquakesor: object;
  earthquakesro: object;
  clusterLayers: Layer[];
  clusterLayersor: Layer[];
  clusterLayersro: Layer[];

  layerId = 'dark';
  style: string;
  account: Account;
  modalRef: NgbModalRef;

  constructor(private accountService: AccountService) {}

  async ngOnInit() {

    //debut code des couleurs sur la map(vert)

    this.earthquakes = await import('./vert.geo.json');
    const layersData: [number, string][] = [
      [200, 'green']
    ];
    this.clusterLayers = layersData.map((data, index) => ({
      id: `cluster-${index}`,
      paint: {
        'circle-color': data[1],
        'circle-radius': 70,
        'circle-blur': 1
      }

    }));

//fin code du vert sur la map

    //debut code orange
    this.earthquakesor = await import('./orange.geo.json');
    const layersDataor: [number, string][] = [
      [200, 'orange']
    ];
    this.clusterLayersor = layersDataor.map((dataor, indexor) => ({
      id: `cluster-${indexor}`,
      paint: {
        'circle-color': dataor[1],
        'circle-radius': 70,
        'circle-blur': 1
      },
    }));

    //fin code orange


    // debut code du rouge

    this.earthquakesro = await import('./rouge.geo.json');
    const layersDataro: [number, string][] = [
      [200, 'red']
    ];
    this.clusterLayersro = layersDataro.map((dataro, indexro) => ({
      id: `cluster-${indexro}`,
      paint: {
        'circle-color': dataro[1],
        'circle-radius': 70,
        'circle-blur': 1
      },
    }));

    //fin code du rouge

    this.changeStyle(this.layerId);
    this.accountService.identity().then((account: Account) => {
      this.account = account;
    });
  }

  //changer la vue

  changeStyle(layerId: string) {
    this.style = `mapbox://styles/mapbox/${layerId}-v9`;
  }

  //fin changer la vue

}
