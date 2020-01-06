import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IKpi } from 'app/shared/model/kpi.model';
import { AccountService } from 'app/core';
import { KpiService } from './kpi.service';

@Component({
  selector: 'jhi-kpi',
  templateUrl: './kpi.component.html'
})
export class KpiComponent implements OnInit, OnDestroy {
  kpis: IKpi[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected kpiService: KpiService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.kpiService
      .query()
      .pipe(
        filter((res: HttpResponse<IKpi[]>) => res.ok),
        map((res: HttpResponse<IKpi[]>) => res.body)
      )
      .subscribe(
        (res: IKpi[]) => {
          this.kpis = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInKpis();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IKpi) {
    return item.id;
  }

  registerChangeInKpis() {
    this.eventSubscriber = this.eventManager.subscribe('kpiListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
