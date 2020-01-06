import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { FrontappliSharedModule } from 'app/shared';
import {
  QosComponent,
  QosDetailComponent,
  QosUpdateComponent,
  QosDeletePopupComponent,
  QosDeleteDialogComponent,
  qosRoute,
  qosPopupRoute
} from './';

const ENTITY_STATES = [...qosRoute, ...qosPopupRoute];

@NgModule({
  imports: [FrontappliSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [QosComponent, QosDetailComponent, QosUpdateComponent, QosDeleteDialogComponent, QosDeletePopupComponent],
  entryComponents: [QosComponent, QosUpdateComponent, QosDeleteDialogComponent, QosDeletePopupComponent],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FrontappliQosModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
