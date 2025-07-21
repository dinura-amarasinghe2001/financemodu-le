import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInventoryBatches } from '../inventory-batches.model';
import { InventoryBatchesService } from '../service/inventory-batches.service';
import { InventoryBatchesFormGroup, InventoryBatchesFormService } from './inventory-batches-form.service';

@Component({
  selector: 'jhi-inventory-batches-update',
  templateUrl: './inventory-batches-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InventoryBatchesUpdateComponent implements OnInit {
  isSaving = false;
  inventoryBatches: IInventoryBatches | null = null;

  protected inventoryBatchesService = inject(InventoryBatchesService);
  protected inventoryBatchesFormService = inject(InventoryBatchesFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: InventoryBatchesFormGroup = this.inventoryBatchesFormService.createInventoryBatchesFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ inventoryBatches }) => {
      this.inventoryBatches = inventoryBatches;
      if (inventoryBatches) {
        this.updateForm(inventoryBatches);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const inventoryBatches = this.inventoryBatchesFormService.getInventoryBatches(this.editForm);
    if (inventoryBatches.id !== null) {
      this.subscribeToSaveResponse(this.inventoryBatchesService.update(inventoryBatches));
    } else {
      this.subscribeToSaveResponse(this.inventoryBatchesService.create(inventoryBatches));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInventoryBatches>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(inventoryBatches: IInventoryBatches): void {
    this.inventoryBatches = inventoryBatches;
    this.inventoryBatchesFormService.resetForm(this.editForm, inventoryBatches);
  }
}
