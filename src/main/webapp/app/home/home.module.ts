import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FrontappliSharedModule } from 'app/shared';
import { HOME_ROUTE, HomeComponent } from './';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

@NgModule({
  imports: [FrontappliSharedModule, RouterModule.forChild([HOME_ROUTE]), NgxMapboxGLModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FrontappliHomeModule {}
