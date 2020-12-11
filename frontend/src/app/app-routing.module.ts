import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureViewComponent } from './secure-view/secure-view.component';

const routes: Routes = [
  { path: 'secure-view', component: SecureViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
