import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ITechnicien } from 'app/shared/model/technicien.model';
import { AccountService } from 'app/core';
import { TechnicienService } from './technicien.service';

@Component({
  selector: 'jhi-technicien',
  templateUrl: './technicien.component.html'
})
export class TechnicienComponent implements OnInit, OnDestroy {
  techniciens: ITechnicien[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected technicienService: TechnicienService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.technicienService
      .query()
      .pipe(
        filter((res: HttpResponse<ITechnicien[]>) => res.ok),
        map((res: HttpResponse<ITechnicien[]>) => res.body)
      )
      .subscribe(
        (res: ITechnicien[]) => {
          this.techniciens = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInTechniciens();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ITechnicien) {
    return item.id;
  }

  registerChangeInTechniciens() {
    this.eventSubscriber = this.eventManager.subscribe('technicienListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
