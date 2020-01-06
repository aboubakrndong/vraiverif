import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'qos',
        loadChildren: () => import('./qos/qos.module').then(m => m.FrontappliQosModule)
      },
      {
        path: 'zones',
        loadChildren: () => import('./zones/zones.module').then(m => m.FrontappliZonesModule)
      },
      {
        path: 'kpi',
        loadChildren: () => import('./kpi/kpi.module').then(m => m.FrontappliKpiModule)
      },
      {
        path: 'alertes',
        loadChildren: () => import('./alertes/alertes.module').then(m => m.FrontappliAlertesModule)
      },
      {
        path: 'bts',
        loadChildren: () => import('./bts/bts.module').then(m => m.FrontappliBtsModule)
      },
      {
        path: 'taches',
        loadChildren: () => import('./taches/taches.module').then(m => m.FrontappliTachesModule)
      },
      {
        path: 'technicien',
        loadChildren: () => import('./technicien/technicien.module').then(m => m.FrontappliTechnicienModule)
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FrontappliEntityModule {}
