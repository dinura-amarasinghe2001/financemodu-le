import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-readsupplier',
  standalone: true,
imports: [RouterModule], // ⬅️ Add this
  templateUrl: './readsupplier.component.html',
  styleUrl: './readsupplier.component.scss'
})
export class ReadsupplierComponent {

}
