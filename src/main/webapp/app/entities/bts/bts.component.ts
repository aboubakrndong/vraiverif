import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IBts } from 'app/shared/model/bts.model';
import { AccountService } from 'app/core';
import { BtsService } from './bts.service';

@Component({
  selector: 'jhi-bts',
  templateUrl: './bts.component.html'
})
export class BtsComponent implements OnInit, OnDestroy {
  bts: IBts[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected btsService: BtsService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.btsService
      .query()
      .pipe(
        filter((res: HttpResponse<IBts[]>) => res.ok),
        map((res: HttpResponse<IBts[]>) => res.body)
      )
      .subscribe(
        (res: IBts[]) => {
          this.bts = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInBts();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IBts) {
    return item.id;
  }

  registerChangeInBts() {
    this.eventSubscriber = this.eventManager.subscribe('btsListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
