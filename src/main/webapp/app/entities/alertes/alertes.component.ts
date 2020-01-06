import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IAlertes } from 'app/shared/model/alertes.model';
import { AccountService } from 'app/core';
import { AlertesService } from './alertes.service';

@Component({
  selector: 'jhi-alertes',
  templateUrl: './alertes.component.html'
})
export class AlertesComponent implements OnInit, OnDestroy {
  alertes: IAlertes[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected alertesService: AlertesService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.alertesService
      .query()
      .pipe(
        filter((res: HttpResponse<IAlertes[]>) => res.ok),
        map((res: HttpResponse<IAlertes[]>) => res.body)
      )
      .subscribe(
        (res: IAlertes[]) => {
          this.alertes = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInAlertes();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IAlertes) {
    return item.id;
  }

  registerChangeInAlertes() {
    this.eventSubscriber = this.eventManager.subscribe('alertesListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
