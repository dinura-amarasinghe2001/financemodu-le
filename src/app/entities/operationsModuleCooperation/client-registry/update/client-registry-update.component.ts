import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IClientRegistry } from '../client-registry.model';
import { ClientRegistryService } from '../service/client-registry.service';
import { ClientRegistryFormGroup, ClientRegistryFormService } from './client-registry-form.service';

@Component({
  selector: 'jhi-client-registry-update',
  templateUrl: './client-registry-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClientRegistryUpdateComponent implements OnInit {
  isSaving = false;
  clientRegistry: IClientRegistry | null = null;

  protected clientRegistryService = inject(ClientRegistryService);
  protected clientRegistryFormService = inject(ClientRegistryFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ClientRegistryFormGroup = this.clientRegistryFormService.createClientRegistryFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clientRegistry }) => {
      this.clientRegistry = clientRegistry;
      if (clientRegistry) {
        this.updateForm(clientRegistry);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const clientRegistry = this.clientRegistryFormService.getClientRegistry(this.editForm);
    if (clientRegistry.id !== null) {
      this.subscribeToSaveResponse(this.clientRegistryService.update(clientRegistry));
    } else {
      this.subscribeToSaveResponse(this.clientRegistryService.create(clientRegistry));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClientRegistry>>): void {
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

  protected updateForm(clientRegistry: IClientRegistry): void {
    this.clientRegistry = clientRegistry;
    this.clientRegistryFormService.resetForm(this.editForm, clientRegistry);
  }
}
