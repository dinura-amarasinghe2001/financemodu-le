import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,AfterViewInit,  OnInit, 
    inject,
    ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IGRNLines } from 'app/entities/inventorymicro/grn-lines/grn-lines.model';
import { GRNLinesService } from 'app/entities/inventorymicro/grn-lines/service/grn-lines.service';
import { IGRN } from 'app/entities/inventorymicro/grn/grn.model';
import { GRNService } from 'app/entities/inventorymicro/grn/service/grn.service';
import { ISupplier } from 'app/entities/inventorymicro/supplier/supplier.model';
import { CommonModule } from '@angular/common';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';
@Component({
    selector: 'modern',
    templateUrl: './modern.component.html',
    encapsulation: ViewEncapsulation.None,
  
    standalone: true,
      imports: [CommonModule],
})
export class ModernComponent implements OnInit {
    /**
     * Constructor
     */
grnservice=inject(GRNService);
grnlines=inject(GRNLinesService);
suppierser=inject(SupplierService);
 supplier: IGRN[] = [];
supplierline: IGRNLines[] = [];
grncode:string | null = null;
supplierName: string | null = null;
  supplierAddress: string;
  poNum: string;
  grnDate:any;
supinvoc: any;
  supinvonam: any;
  today = new Date();

 constructor(private route: ActivatedRoute ) {}
issueNumber: string;
pageCount: number = 0;
chunkedItems: any[][] = [];
grnTotal: number = 0;

ngOnInit(): void {
    this.issueNumber = 'ISSUE' + Math.floor(1000 + Math.random() * 9000);
  const id = this.route.snapshot.paramMap.get('id');
  console.log('Supplier ID:', id);
 
  if (id) {
    const numericId = Number(id);

    // Fetch supplier
    this.grnservice.query({ 'id.equals': numericId }).subscribe({
      next: (response) => {
        this.supplier = Array.isArray(response.body)
          ? response.body
          : response.body
          ? [response.body]
          : [];

        if (this.supplier.length > 0) {
          this.grncode = this.supplier[0].grnCode; // ✅ Safe to assign here
          console.log('Supplier Data:', this.supplier[0]);
          this.supplierName= this.supplier[0].supplierName; // ✅ Safe to assign here

       
          this.supplierAddress = this.supplier[0].supplierAddress; // ✅ Safe to assign here
          this.supinvoc = this.supplier[0].supplierInvoiceCode; // ✅ Safe to assign here
          this.supinvonam= this.supplier[0].supplierInvoiceDate; // ✅ Safe to assign here
this.poNum=this.supplier[0].poNum; // ✅ Safe to assign here
this.grnDate=this.supplier[0].grnDate; // ✅ Safe to assign here
        console.log('Supplier Nameaaaaaaa:', this.supplierName);
    this.suppierser.query({ 'name.equals': this.supplierName }).subscribe({
      next: (response) => {
        const suppliers = Array.isArray(response.body)
          ? response.body
          : response.body
          ? [response.body]
          : [];
        console.log('Suppliers Data:', suppliers);

        this.supplierAddress=suppliers[0].addressOffice || suppliers[0].addressFactory;
      },
      error: (error) => {
        console.error('Error fetching suppliers data:', error);
      }
    })




        }
      },
      error: (error) => {
        console.error('Error fetching supplier data:', error);
      }
    });

    // Fetch supplier lines
    this.grnlines.query({ 'grnId.equals': numericId , size: 20000000}).subscribe({
      next: (response) => {
        this.supplierline = Array.isArray(response.body)
          ? response.body
          : response.body
          ? [response.body]
          : [];
        console.log('Supplier Lines Data:', this.supplierline);
         this.grnTotal = this.supplierline.reduce((acc, item) => acc + (item.lineTotal || 0), 0)
         this.chunkedItems = this.chunkArray(this.supplierline,35);
        
  this.pageCount = this.chunkedItems.length;
      },
      error: (error) => {
        console.error('Error fetching supplier lines data:', error);
      }
    });
   
     setTimeout(() => {
      window.print();
    }, 1000)

     this.chunkedItems = this.chunkArray(this.supplierline, 35);

  } else {
    console.warn('No ID provided in route parameters.');
  }
}

chunkArray(arr: any[], chunkSize: number): any[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}



}
