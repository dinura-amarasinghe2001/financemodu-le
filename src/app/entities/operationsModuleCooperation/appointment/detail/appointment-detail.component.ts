import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IAppointment } from '../appointment.model';

@Component({
  selector: 'jhi-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class AppointmentDetailComponent {
  appointment = input<IAppointment | null>(null);

  previousState(): void {
    window.history.back();
  }
}
