import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITaches } from 'app/shared/model/taches.model';
import { AccountService } from 'app/core';
import { TachesService } from './taches.service';

@Component({
  selector: 'jhi-taches',
  templateUrl: './taches.component.html'
})
export class TachesComponent implements OnInit, OnDestroy {
  taches: ITaches[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected tachesService: TachesService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.tachesService
      .query()
      .pipe(
        filter((res: HttpResponse<ITaches[]>) => res.ok),
        map((res: HttpResponse<ITaches[]>) => res.body)
      )
      .subscribe(
        (res: ITaches[]) => {
          this.taches = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInTaches();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ITaches) {
    return item.id;
  }

  registerChangeInTaches() {
    this.eventSubscriber = this.eventManager.subscribe('tachesListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
