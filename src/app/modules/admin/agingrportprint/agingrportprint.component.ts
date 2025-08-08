import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { BinCardService } from 'app/entities/inventorymicro/bin-card/service/bin-card.service';
import { GRNService } from 'app/entities/inventorymicro/grn/service/grn.service';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';

@Component({
  selector: 'app-agingrportprint',
 standalone: true,
  imports: [MatIconModule,
              FormsModule,
              ReactiveFormsModule,
              MatStepperModule,
              MatFormFieldModule,
              MatInputModule,
              MatSelectModule,
              MatOptionModule,
              MatButtonModule,
              MatCheckboxModule,
              MatRadioModule, MatTableModule,MatAutocompleteModule,CommonModule,  MatExpansionModule,   MatCardModule,MatSidenavModule,    MatDatepickerModule,
        MatNativeDateModule,MatPaginatorModule,MatTooltipModule ],
  templateUrl: './agingrportprint.component.html',
  styleUrl: './agingrportprint.component.scss'
})
export class AgingrportprintComponent {
filter: any = {
    code: '',
    name: '',
    dateRange: { start: null, end: null }
  };

  supplier: any[] = [];
  chunkedSupplierRecords: any[][] = []; // <-- add this here
  totalItems = 0;
  totalPages = 0;
  pageSize = 10;
supplierDetails: any = null;
  constructor(private route: ActivatedRoute, private bincardservice: GRNService, private supplierservice: SupplierService) {}
getChunkTotal(chunk: any[]): number {
  return chunk.reduce((sum, rec) => sum + (rec.total || 0), 0);
}
ngOnInit(): void {
  const params: any = { 'inspected.equals': false};
  const query = this.route.snapshot.queryParams;

  if (query['name']) {
    this.filter.name = query['name'];
    params['supplierName.contains'] = this.filter.name;
  }

  if (query['startDate']) {
    this.filter.dateRange.start = new Date(query['startDate']);
    params['grnDate.greaterThanOrEqual'] = this.formatDate(this.filter.dateRange.start, 'start');
  }

  if (query['endDate']) {
    this.filter.dateRange.end = new Date(query['endDate']);
    params['grnDate.lessThanOrEqual'] = this.formatDate(this.filter.dateRange.end, 'end');
  }

  params['size'] = 20000000;
  console.log('Final Params:', params);

  this.bincardservice.query(params).subscribe({
    next: response => {
      this.supplier = response.body || [];
      this.chunkedSupplierRecords = this.chunkArray(this.supplier, 50);
      console.log('Chunked Supplier Records:', this.supplier);
      const total = response.headers.get('X-Total-Count');
      this.totalItems = total ? +total : 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    },
    error: err => {
      console.error('Error fetching supplier data:', err);
    }
  });

 const query1 = {
  'name.equals': this.filter.name
};

this.supplierservice.query(query1).subscribe({
  next: (response) => {
    console.log('Responsezzzzzzzzz:', response.body[0]);
         this.supplierDetails = response.body[0]; // store the first result
    // handle your data
  },
  error: (err) => {
    console.error('Error:', err);
  }
});



 

  } 


  chunkArray<T>(arr: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }

  formatDate(date: Date, type: 'start' | 'end'): string {
    const d = new Date(date);
    if (type === 'start') {
      d.setHours(0, 0, 0, 0);
    } else {
      d.setHours(23, 59, 59, 999);
    }
    return d.toISOString();
  }
  getDifferenceWithToday(dateStr: string): string {
  if (!dateStr) return '-';
  
  const invoiceDate = new Date(dateStr);
  const today = new Date();
  
  // Reset time portion for clean day difference
  invoiceDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = invoiceDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays > 0) {
    return `${diffDays} day(s) ahead`;
  } else {
    return `${Math.abs(diffDays)} day(s) ago`;
  }
}

}
