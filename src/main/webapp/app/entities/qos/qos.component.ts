import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IQos } from 'app/shared/model/qos.model';
import { AccountService } from 'app/core';
import { QosService } from './qos.service';

@Component({
  selector: 'jhi-qos',
  templateUrl: './qos.component.html'
})
export class QosComponent implements OnInit, OnDestroy {
  qos: IQos[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected qosService: QosService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.qosService
      .query()
      .pipe(
        filter((res: HttpResponse<IQos[]>) => res.ok),
        map((res: HttpResponse<IQos[]>) => res.body)
      )
      .subscribe(
        (res: IQos[]) => {
          this.qos = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInQos();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IQos) {
    return item.id;
  }

  registerChangeInQos() {
    this.eventSubscriber = this.eventManager.subscribe('qosListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
