import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BinCardService } from 'app/entities/inventorymicro/bin-card/service/bin-card.service';

@Component({
  selector: 'app-bincard-print',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bincard-print.component.html',
  styleUrl: './bincard-print.component.scss'
})
export class BincardPrintComponent implements OnInit {
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

  constructor(private route: ActivatedRoute, private bincardservice: BinCardService) {}

  ngOnInit(): void {
    const params: any = {};
    const query = this.route.snapshot.queryParams;

    if (query['grncode']) {
      this.filter.code = query['grncode'];
      params['itemCode.contains'] = this.filter.code;
    }

    if (query['grnname']) {
      this.filter.name = query['grnname'];
      params['reference.contains'] = this.filter.name;
    }

    if (query['grndaterange']) {
      const [start, end] = query['grndaterange'].split('|');
      if (start) {
        this.filter.dateRange.start = new Date(start);
        params['recordDate.greaterThanOrEqual'] = this.formatDate(this.filter.dateRange.start, 'start');
      }
      if (end) {
        this.filter.dateRange.end = new Date(end);
        params['recordDate.lessThanOrEqual'] = this.formatDate(this.filter.dateRange.end, 'end');
      }
    }

    params['size'] = 20000000; // large enough to get all records

    this.bincardservice.query(params).subscribe({
      next: response => {
        this.supplier = response.body || [];
        this.chunkedSupplierRecords = this.chunkArray(this.supplier, 50); // chunk into groups of 50 here!
        const total = response.headers.get('X-Total-Count');
        this.totalItems = total ? +total : 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      },
      error: err => {
        console.error('Error fetching supplier data:', err);
      }
    });

    setTimeout(() => {
      window.print();
    }, 1000);
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
}
