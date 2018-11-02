import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { NewEventComponent } from './events/new-event/new-event.component';
import { EventEditComponent } from './events/event-edit/event-edit.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'events', component: EventsComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: 'events/new', component: NewEventComponent, canActivate: [AuthGuard] },
  { path: 'events/edit/:id', component: EventEditComponent, canActivate: [AuthGuard]}, 
  { path: 'events/:id', component: EventDetailComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
