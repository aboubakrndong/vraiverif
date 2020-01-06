import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FrontappliSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';
import { JhMaterialModule } from 'app/shared/jh-material/jh-material.module';

@NgModule({
  imports: [FrontappliSharedCommonModule, JhMaterialModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [FrontappliSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective, JhMaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FrontappliSharedModule {
  static forRoot() {
    return {
      ngModule: FrontappliSharedModule
    };
  }
}
