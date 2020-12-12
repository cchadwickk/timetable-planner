import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecureViewComponent } from './secure-view/secure-view.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';
import { GuestComponent } from './guest/guest.component';
import { GuestTimetablesComponent } from './guest-timetables/guest-timetables.component';

const routes: Routes = [
  { path: 'secure', component: SecureViewComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'about', component: AboutComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'guest', component: GuestComponent },
  { path: 'guest-timetables/:courseListName', component: GuestTimetablesComponent },
  { path: '', redirectTo: '/about', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
