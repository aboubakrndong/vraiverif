import { Component, Input, OnInit } from '@angular/core';
import { IQos } from 'app/shared/model/qos.model';
import { IKpi } from 'app/shared/model/kpi.model';
import { IBts } from 'app/shared/model/bts.model';
import { IZones } from 'app/shared/model/zones.model';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ZonesService } from 'app/entities/zones';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KpiService } from 'app/entities/kpi';
import { BtsService } from 'app/entities/bts';

export interface PeriodicElementBts {
  id?: number;
  type?: string;
  etat?: string;
  puissance?: string;
  bandedefrequence?: string;
}

@Component({
  selector: 'jhi-vuebts',
  templateUrl: './vuebts.component.html',
  styleUrls: ['./vuebts.component.scss']
})
export class VuebtsComponent implements OnInit {
  @Input() zone: IZones;

  listbts: IBts[];
  ELEMENT_DATABTS: PeriodicElementBts[];
  bts: IBts;
  selectedValue: number;
  toSelectedValue: number;

  dataSourceBts = new MatTableDataSource(this.ELEMENT_DATABTS);

  constructor(
    private btsService: BtsService,
    public dialog: MatDialog,
    public undialog: MatDialog,
    private zoneService: ZonesService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listbts = new Array<IBts>();
    this.btsService.findAll().subscribe(liste => {
      console.log(liste.body);
      this.listbts = liste.body;
    });
  }

  getBtsById(event: any) {
    this.toSelectedValue = 0;
    this.selectedValue = this.zone.id;
    this.btsService.find(this.selectedValue).subscribe(bts => {
      console.log(bts);
      this.bts = bts.body;
      this.ELEMENT_DATABTS = [
        {
          id: this.bts.id,
          type: this.bts.type,
          etat: this.bts.etat,
          puissance: this.bts.puissance
        }
      ];
      this.dataSourceBts = new MatTableDataSource(this.ELEMENT_DATABTS);
    });
  }

  getUneBtsById(event: any) {
    this.selectedValue = 0;

    this.toSelectedValue = this.zone.id;
    this.btsService.find(this.toSelectedValue).subscribe(bts => {
      console.log(bts);
      this.bts = bts.body;
      this.ELEMENT_DATABTS = [
        {
          id: this.bts.id,
          type: this.bts.type,
          etat: this.bts.etat,
          puissance: this.bts.puissance
        }
      ];
      this.dataSourceBts = new MatTableDataSource(this.ELEMENT_DATABTS);
    });
  }
}
