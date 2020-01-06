import { Component, Input, OnInit } from '@angular/core';
import { IZones } from 'app/shared/model/zones.model';
import { IBts } from 'app/shared/model/bts.model';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { PeriodicElement } from 'app/sidebar/sidebar.component';
import { BtsService } from 'app/entities/bts';
import { IQos } from 'app/shared/model/qos.model';
import { IKpi } from 'app/shared/model/kpi.model';
import { ZonesService } from 'app/entities/zones';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface PeriodicBts {
  id?: number;
  etat?: string;
  type?: string;
}

@Component({
  selector: 'jhi-voirbts',
  templateUrl: './voirbts.component.html',
  styleUrls: ['./voirbts.component.scss']
})
export class VoirbtsComponent implements OnInit {
  @Input() zone: IZones;

  listbts: IBts[];
  ELEMENT_DATABTS: PeriodicBts[];
  bts: IBts;
  selectedValuebts: number;
  dataSourcebts = new MatTableDataSource(this.ELEMENT_DATABTS);

  constructor(
    private btsService: BtsService,
    public dialog: MatDialog,
    private zoneService: ZonesService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.listbts = new Array<IBts>();
    this.btsService.findAll().subscribe(listebts => {
      console.log(listebts.body);
      this.listbts = listebts.body;
    });
  }

  getBtsById(event: any) {
    this.selectedValuebts = this.zone.id;

    this.btsService.find(this.selectedValuebts).subscribe(bts => {
      console.log(bts);
      this.bts = bts.body;
      this.ELEMENT_DATABTS = [
        {
          id: this.bts.id,
          etat: this.bts.etat,
          type: this.bts.type
        }
      ];
      this.dataSourcebts = new MatTableDataSource(this.ELEMENT_DATABTS);
    });
  }
}
