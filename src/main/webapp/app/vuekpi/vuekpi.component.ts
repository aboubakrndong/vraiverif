import { Component, Input, OnInit } from '@angular/core';
import { IQos } from 'app/shared/model/qos.model';
import { IKpi } from 'app/shared/model/kpi.model';
import { IBts } from 'app/shared/model/bts.model';
import { IZones } from 'app/shared/model/zones.model';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ZonesService } from 'app/entities/zones';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KpiService } from 'app/entities/kpi';

export interface PeriodicElementKpi {
  id?: number;
  tauxdappels?: string;
  tauxdepertes?: string;
  tauxderejets?: string;
}

@Component({
  selector: 'jhi-vuekpi',
  templateUrl: './vuekpi.component.html',
  styleUrls: ['./vuekpi.component.scss']
})
export class VuekpiComponent implements OnInit {
  @Input() zone: IZones;

  listkpi: IKpi[];
  ELEMENT_DATAKPI: PeriodicElementKpi[];
  kpi: IKpi;
  selectedValue: number;
  toselectedValue: number;

  dataSourceKpi = new MatTableDataSource(this.ELEMENT_DATAKPI);

  constructor(
    private kpiService: KpiService,
    public dialog: MatDialog,
    public undialog: MatDialog,
    private zoneService: ZonesService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listkpi = new Array<IKpi>();
    this.kpiService.findAll().subscribe(liste => {
      console.log(liste.body);
      this.listkpi = liste.body;
    });
  }

  getKpiById(event: any) {
    this.toselectedValue = 0;
    this.selectedValue = this.zone.id;

    this.kpiService.find(this.selectedValue).subscribe(kpi => {
      console.log(kpi);
      this.kpi = kpi.body;
      this.ELEMENT_DATAKPI = [
        {
          id: this.kpi.id,
          tauxdappels: this.kpi.tauxdappels,
          tauxdepertes: this.kpi.tauxdepertes,
          tauxderejets: this.kpi.tauxderejets
        }
      ];
      this.dataSourceKpi = new MatTableDataSource(this.ELEMENT_DATAKPI);
    });
  }

  getSmsById(unevent: any) {
    this.selectedValue = 0;
    this.toselectedValue = this.zone.id;
    this.kpiService.find(this.toselectedValue).subscribe(kpi => {
      console.log(kpi);
      this.kpi = kpi.body;
      this.ELEMENT_DATAKPI = [
        {
          id: this.kpi.id,
          tauxdappels: this.kpi.tauxdappels,
          tauxdepertes: this.kpi.tauxdepertes,
          tauxderejets: this.kpi.tauxderejets
        }
      ];
      this.dataSourceKpi = new MatTableDataSource(this.ELEMENT_DATAKPI);
    });
  }
}
