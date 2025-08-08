import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { AccountsService } from 'app/entities/financemicro/accounts/service/accounts.service';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-trailbalance',  // corrected selector spelling
  standalone: true,
  imports: [
    CommonModule,
    NgForOf,
    MatSidenavModule,
    MatButtonModule,
    MatTableModule 
  ],
  templateUrl: './trailbalance.component.html',  // corrected filename spelling
  styleUrls: ['./trailbalance.component.scss']
})
export class TrailbalanceComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatDrawer;

  todayDate: Date = new Date();
  currentTime: string = '';
  accountservice = inject(AccountsService);

  liabilities: any[] = [];
  expenses: any[] = [];
  assets: any[] = [];
  income: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.accountservice.query({ 'parent.contains': 'Liability' }).subscribe({
      next: (response) => {
        this.liabilities = response.body || [];
        console.log('Liabilities fetched:', this.liabilities);
        this.updateFlatData();
      },
      error: (err) => {
        console.error('Failed to fetch liabilities:', err);
      }
    });

    this.accountservice.query({ 'parent.contains': 'Assets' }).subscribe({
      next: (response) => {
        this.assets = response.body || [];
        console.log('Assets fetched:', this.assets);
        this.updateFlatData();
      },
      error: (err) => {
        console.error('Failed to fetch assets:', err);
      }
    });

    this.accountservice.query({ 'parent.contains': 'Expenses' }).subscribe({
      next: (response) => {
        this.expenses = response.body || [];
        console.log('Expenses fetched:', this.expenses);
        this.updateFlatData();
      },
      error: (err) => {
        console.error('Failed to fetch expenses:', err);
      }
    });

    this.accountservice.query({ 'parent.contains': 'Income' }).subscribe({
      next: (response) => {
        this.income = response.body || [];
        console.log('Income fetched:', this.income);
        this.updateFlatData();
      },
      error: (err) => {
        console.error('Failed to fetch income:', err);
      }
    });

      setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
    }, 1000);
  }

  flatRelatedData: any[] = [];
  updateFlatData(): void {
  this.flatRelatedData = [
    ...this.liabilities,
    ...this.assets,
    ...this.expenses,
    ...this.income
  ];
}

displayedColumns: string[] = ['code', 'child', 'debitAmount', 'creditAmount'];


}