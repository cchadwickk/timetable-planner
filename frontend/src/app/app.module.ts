import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {TableModule} from 'primeng/table';

import { AppComponent } from './app.component';
import { TopbarComponent } from './topbar/topbar.component';
import { AlertsComponent } from './alerts/alerts.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';
import { AdminComponent } from './admin/admin.component';
import { GuestComponent } from './guest/guest.component';
import { ExpandableTableWithButtonsComponent } from './expandable-table-with-buttons/expandable-table-with-buttons.component';
import { GuestTimetablesComponent } from './guest-timetables/guest-timetables.component';
import { SecureComponent } from './secure/secure.component';

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    AlertsComponent,
    RegisterComponent,
    AboutComponent,
    AdminComponent,
    GuestComponent,
    ExpandableTableWithButtonsComponent,
    GuestTimetablesComponent,
    SecureComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    TableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
