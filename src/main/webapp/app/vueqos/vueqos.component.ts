import {Component, Input, OnInit} from '@angular/core';
import {IZones} from "app/shared/model/zones.model";
import {MatDialog, MatTableDataSource} from "@angular/material";
import {IQos} from "app/shared/model/qos.model";
import {ZonesService} from "app/entities/zones";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {QosService } from "app/entities/qos";

export interface PeriodicElementQos {
  id?: number;
  traffic?:string;
  tempsdereponse?:string;
  sensibilité?:string;
  debit?:string;
}


@Component({
  selector: 'jhi-vueqos',
  templateUrl: './vueqos.component.html',
  styleUrls: ['./vueqos.component.scss']
})
export class VueqosComponent implements OnInit {
@Input () zone: IZones;

  listqos: IQos[];
  ELEMENT_DATAQOS: PeriodicElementQos[];
  qos: IQos;
  selectedValue: number;
  dataSourceQos = new MatTableDataSource(this.ELEMENT_DATAQOS);


  constructor(public qosService: QosService, public dialog: MatDialog,public undialog: MatDialog, private zoneService: ZonesService, private modalService: NgbModal,) { }

  ngOnInit() {
    this.listqos = new Array<IQos>();
    this.qosService.findAll().subscribe(liste => {
      console.log(liste.body);
      this.listqos = liste.body;
    });

  }

  getQosById(event: any) {
    this.selectedValue = this.zone.id;

    this.qosService.find(this.selectedValue).subscribe(qos => {
      console.log(qos);
      this.qos = qos.body;
      this.ELEMENT_DATAQOS = [
        {
          id: this.qos.id,
          traffic: this.qos.traffic,
          tempsdereponse: this.qos.tempsdereponse,
          sensibilité: this.qos.sensibilite,
          debit: this.qos.debit
        }
      ];
      this.dataSourceQos = new MatTableDataSource(this.ELEMENT_DATAQOS);
    });
  }

}
