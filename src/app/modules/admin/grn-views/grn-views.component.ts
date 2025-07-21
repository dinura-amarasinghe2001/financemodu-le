import { CommonModule } from '@angular/common';
import { Component, inject, Inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
 
import { MatStepperModule } from '@angular/material/stepper';
import { IGRNLines } from 'app/entities/inventorymicro/grn-lines/grn-lines.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SupplierviewComponent } from '../supplierview/supplierview/supplierview.component';
import { GRNLinesService } from 'app/entities/inventorymicro/grn-lines/service/grn-lines.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIcon } from '@angular/material/icon';
import {InventoryBatchesService} from 'app/entities/inventorymicro/inventory-batches/service/inventory-batches.service'
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-grn-views',
  standalone: true,
  imports: [  CommonModule,
      MatDialogModule,
      MatCardModule,
      MatButtonModule,
      MatStepperModule,
      ReactiveFormsModule,    MatTableModule,MatPaginatorModule,MatIcon, 
    RouterModule],
  templateUrl: './grn-views.component.html',
  styleUrl: './grn-views.component.scss'
})
export class GrnViewsComponent {
 
inventorybatch = inject(InventoryBatchesService)
  grnlines: IGRNLines [] ;
   grnlines1: any [] ;

  constructor(public dialogRef: MatDialogRef<GrnViewsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { id: number,name:string,code:string }, private grnliness: GRNLinesService,  private router: Router) {
    // Initialize grnlines with an empty array or fetch from a service
    this.grnlines = [];
  }
  onAddMore() {
    this.dialogRef.close(); // Close the dialog
    this.router.navigate(['/grn-create'], { queryParams: { suid: this.data.id } }); // Navigate
  }
matColumnDef=['itemName','itemCode','quantity','sellprice','lineTotal']
grnDisplayedColumns: string[] = ['itemName', 'itemCode', 'quantity', 'sellprice','lineTotal'];
 @ViewChild(MatPaginator) paginator!: MatPaginator;
ngOnInit(): void {
    const id = this.data.id;
  
  this.fetchgrlines(id);
  this.fetchnbatch(id);
  
  }
  onClose(): void {
  this.dialogRef.close();
}
  dataSource = new MatTableDataSource<IGRNLines>([]);

  fetchgrlines(id: number): void {
     this.grnliness.query({ 'grnId.equals': id, size: 20000000  }).subscribe({
    next: (data) => {
      this.grnlines  = data.body || [];
      console.log('GRN Lines:', this.grnlines);
             this.dataSource = new MatTableDataSource(this.grnlines);
        this.dataSource.paginator = this.paginator;
    },
    error: (err) => {
      console.error('GRN Lines error:', err);
      // Handle error (show notification, etc.)
    }
  });
  }

fetchnbatch(id: number): void {
  const params = { 'id.equals': id }; // or 'id.contains' if partial match is intended

  this.inventorybatch.query(params).subscribe({
    next: (response) => {
      this.grnlines1 = response.body ?? [];

      console.log('📦 Fetched GRN Line Batches hereeeeeeeee:', this.grnlines1);

      // Optional: Update your data table
       
    },
    error: (err) => {
      console.error('❌ Error fetching GRN Line Batches:', err);
      // Optionally show user notification or fallback
    },
  });
}

}


 