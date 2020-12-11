import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureViewComponent } from './secure-view/secure-view.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'secure-view', component: SecureViewComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
