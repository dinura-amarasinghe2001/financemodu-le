import { Component, NgZone, OnInit, inject, signal } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { ItemCountComponent } from 'app/shared/pagination';
import { FormsModule } from '@angular/forms';
import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { FilterComponent, FilterOptions, IFilterOption, IFilterOptions } from 'app/shared/filter';
import { IVat } from '../vat.model';

import { EntityArrayResponseType, VatService } from '../service/vat.service';
import { VatDeleteDialogComponent } from '../delete/vat-delete-dialog.component';

@Component({
  selector: 'jhi-vat',
  templateUrl: './vat.component.html',
  imports: [RouterModule, FormsModule, SharedModule, SortDirective, SortByDirective, FilterComponent, ItemCountComponent],
})
export class VatComponent implements OnInit {
  private static readonly NOT_SORTABLE_FIELDS_AFTER_SEARCH = ['vatName'];

  subscription: Subscription | null = null;
  vats = signal<IVat[]>([]);
  isLoading = false;

  sortState = sortStateSignal({});
  currentSearch = '';
  filters: IFilterOptions = new FilterOptions();

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  public readonly router = inject(Router);
  protected readonly vatService = inject(VatService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: IVat): number => this.vatService.getVatIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => this.load()),
      )
      .subscribe();

    this.filters.filterChanges.subscribe(filterOptions => this.handleNavigation(1, this.sortState(), filterOptions));
  }

  search(query: string): void {
    this.page = 1;
    this.currentSearch = query;
    const { predicate } = this.sortState();
    if (query && predicate && VatComponent.NOT_SORTABLE_FIELDS_AFTER_SEARCH.includes(predicate)) {
      this.navigateToWithComponentValues(this.getDefaultSortState());
      return;
    }
    this.navigateToWithComponentValues(this.sortState());
  }

  getDefaultSortState(): SortState {
    return this.sortService.parseSortParam(this.activatedRoute.snapshot.data[DEFAULT_SORT_DATA]);
  }

  delete(vat: IVat): void {
    const modalRef = this.modalService.open(VatDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.vat = vat;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(this.page, event, this.filters.filterOptions, this.currentSearch);
  }

  navigateToPage(page: number): void {
    this.handleNavigation(page, this.sortState(), this.filters.filterOptions, this.currentSearch);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
    this.filters.initializeFromParams(params);
    if (params.has('search') && params.get('search') !== '') {
      this.currentSearch = params.get('search') as string;
      const { predicate } = this.sortState();
      if (predicate && VatComponent.NOT_SORTABLE_FIELDS_AFTER_SEARCH.includes(predicate)) {
        this.sortState.set({});
      }
    }
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.vats.set(dataFromBody);
  }

  protected fillComponentAttributesFromResponseBody(data: IVat[] | null): IVat[] {
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    const { page, filters, currentSearch } = this;

    this.isLoading = true;
    const pageToLoad: number = page;
    const queryObject: any = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      query: currentSearch,
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    filters.filterOptions.forEach(filterOption => {
      queryObject[filterOption.name] = filterOption.values;
    });
    if (this.currentSearch && this.currentSearch !== '') {
      return this.vatService.search(queryObject).pipe(tap(() => (this.isLoading = false)));
    }
    return this.vatService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page: number, sortState: SortState, filterOptions?: IFilterOption[], currentSearch?: string): void {
    const queryParamsObj: any = {
      search: currentSearch,
      page,
      size: this.itemsPerPage,
      sort: this.sortService.buildSortParam(sortState),
    };

    filterOptions?.forEach(filterOption => {
      queryParamsObj[filterOption.nameAsQueryParam()] = filterOption.values;
    });

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
