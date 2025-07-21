import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, NgZone, ViewChild, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';
import { SortService, sortStateSignal } from 'app/core/sort';
import { Subscription, merge } from 'rxjs';
import { IBranches } from '../../settings/branches/branches.model';
import { SetupNewOrderDialogComponent } from './setup-new-order-dialog/setup-new-order-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { IOrder } from 'app/entities/dms/order/order.model';
import { OrderService } from 'app/entities/dms/order/service/order.service';
import { ShowDescriptionsComponent } from './show-descriptions/show-descriptions.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserModule } from '@angular/platform-browser';
import { OrderFormService } from 'app/entities/dms/order/update/order-form.service';
import { PaymentType } from 'app/entities/enumerations/payment-type.model';
import { MatSelectModule } from '@angular/material/select';
import { OrderCustomService } from 'app/core/custom-services/v1/order.custom.service';
import { environment } from 'environments/environment.development';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NewOrderSingleComponent } from './new-order-single/new-order-single.component';
import { IMerchant } from 'app/entities/dms/merchant/merchant.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getStateColor } from 'app/core/util/states.colors';

@Component({
    selector: 'app-all-order',
    standalone: true,
    imports: [
        MatIconModule,
        MatExpansionModule,
        RouterLink,

        MatButtonModule,
        MatButtonToggleModule,
        MatSortModule,
        MatDialogModule,
        MatChipsModule,
        FormsModule,
        ReactiveFormsModule,
        CdkScrollable,
        MatTableModule,
        FuseAlertComponent,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatTableModule,
        MatPaginatorModule,
        CommonModule,
        MatSelectModule,
        MatTooltipModule,
        MatTabsModule,
        SetupNewOrderDialogComponent,

        NewOrderSingleComponent,
        MatSidenavModule

    ],
    animations: [
        trigger('detailExpand', [
            state('collapsed,void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    templateUrl: './all-order.component.html',
    styleUrl: './all-order.component.scss',
})
export class AllOrderComponent {
    searchInputControl = new FormControl('');
    subscription: Subscription | null = null;
    branches?: IBranches[];
    isLoading = false;

    sortState = sortStateSignal({ predicate: 'id', order: 'desc' });
    currentSearch = '';

    itemsPerPage = 20;
    totalItems = 0;
    page = 1;
    expandedElement: IOrder | null;
 
    paymentTypes = Object.keys(PaymentType)

    public readonly router = inject(Router);
    protected readonly orderService = inject(OrderCustomService);
    protected readonly activatedRoute = inject(ActivatedRoute);
    protected readonly sortService = inject(SortService);
    protected readonly orderFormService = inject(OrderFormService);
    orderForm = this.orderFormService.createOrderFormGroup()
    protected ngZone = inject(NgZone);
    readonly dialog = inject(MatDialog);

    displayedColumns: string[] = [
        'orderStatus',
        'createdDate',
        // 'merchant',
        'waybillID',
        'id',
        'cod',
        'deliveryCharge',
        'customer',
        'deliveryAddress',
        'city',
        // 'description',
        'branch',
        'remark',
        'hazard',

        'collectedOn',
        'dispatchedOn',
        'completedOn',

        'expand'
    ];
    // columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];


    dataSource = new MatTableDataSource<IOrder>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    sort_params: string[] = ['id,desc'];

    @ViewChild(MatTable) table: MatTable<IOrder>;

    selectedClient: IMerchant = environment.merchant

    constructor() { }
    ngOnInit(): void { }
    ngAfterViewInit(): void {
        this.loadAll();
        // this.selectedClient=environment.
        merge(this.paginator.page).subscribe((res) => {
            this.page = res['pageIndex'];
            this.itemsPerPage = res['pageSize'];
            this.dataSource = new MatTableDataSource<IOrder>([]);
            this.loadAll();
        });
        this.searchInputControl.valueChanges.subscribe((w) => {
            this.loadAll();
        });
    }

    setStatus(label) {
        this.expandedElement.orderStatus = label;
        this.orderService.partialUpdate(this.expandedElement).subscribe(e => {
            this.loadAll();
        });
    }

    onSubmit() {
        this.orderService.createList([this.orderFormService.getOrder(this.orderForm)]).subscribe(w => {
            this.expandedElement = w.body[0]
            this.dataSource.data[this.dataSource.data.findIndex(o => o.id === this.expandedElement.id)] = this.expandedElement;
            this.table.renderRows()
        })
    }
    loadForm(order: IOrder) {
        this.orderForm = this.orderFormService.createOrderFormGroup(order)
    }
    loadAll(): void {
        if (!this.searchInputControl.value) {
            this.orderService
                .query({
                    page: this.page - 1,
                    size: this.itemsPerPage,
                    sort: this.sort_params,
                    'merchantUid.equals': environment.user.id,
                })
                .subscribe({
                    next: (res: HttpResponse<IOrder[]>) => {
                        this.onSuccess(res.body, res.headers);
                    },
                    error: () => { },
                });
        } else {
            this.orderService
                .search({
                    query: this.searchInputControl.value + '*',
                    page: this.page - 1,
                    size: this.itemsPerPage,
                    // sort: this.sort_params,
                })
                .subscribe({
                    next: (res: HttpResponse<IOrder[]>) => {
                        this.onSuccess(res.body, res.headers);
                    },
                    error: () => { },
                });
        }
    }

    private onSuccess(branches: IOrder[] | null, headers: HttpHeaders): void {
        this.totalItems = Number(headers.get('X-Total-Count'));
        console.log(this.totalItems);

        this.dataSource = new MatTableDataSource<IOrder>(branches);
    }

    createOrEdit(entity) { }

    announceSortChange($event) { }



    openCreateBranch() {
        const dialogRef = this.dialog.open(SetupNewOrderDialogComponent, {
            width: '850px',
            height: '860px',
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.loadAll();
        });
    }

    openRemarkOrDes(title: string, des: string) {
        const dialogRef = this.dialog.open(ShowDescriptionsComponent, {
            width: '450px',
            height: '250px',
            data: { des, title }
        });

        dialogRef.afterClosed().subscribe((result) => {

        });
    }
    showSign(order: IOrder,sign) { 
        if(order.parcelType==null) return false;
        return order.parcelType.split(',').includes(sign);
    }
    orderStatusColors(state) {
        return getStateColor(state);
    }
}
