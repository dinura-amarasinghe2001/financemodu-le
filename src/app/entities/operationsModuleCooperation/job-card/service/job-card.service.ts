import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, asapScheduler, map, scheduled } from "rxjs";

import { catchError } from "rxjs/operators";

import dayjs from "dayjs/esm";

import { isPresent } from "app/core/util/operators";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { SearchWithPagination } from "app/core/request/request.model";
import { IJobCard, NewJobCard } from "../job-card.model";

export type PartialUpdateJobCard = Partial<IJobCard> & Pick<IJobCard, "id">;

type RestOf<T extends IJobCard | NewJobCard> = Omit<
  T,
  | "startDate"
  | "jobCompleteDate"
  | "boothDate"
  | "tinkeringStartDateTime"
  | "tinkeringEndDateTime"
  | "paintStartDateTime"
  | "paintEndDateTime"
  | "qcStartDateTime"
  | "qcEndDateTime"
  | "sparePartStartDateTime"
  | "sparePartEndDateTime"
  | "fittingStartDateTime"
  | "fittingEndDateTime"
  | "createdDate"
  | "lastModifiedDate"
> & {
  startDate?: string | null;
  jobCompleteDate?: string | null;
  boothDate?: string | null;
  tinkeringStartDateTime?: string | null;
  tinkeringEndDateTime?: string | null;
  paintStartDateTime?: string | null;
  paintEndDateTime?: string | null;
  qcStartDateTime?: string | null;
  qcEndDateTime?: string | null;
  sparePartStartDateTime?: string | null;
  sparePartEndDateTime?: string | null;
  fittingStartDateTime?: string | null;
  fittingEndDateTime?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestJobCard = RestOf<IJobCard>;

export type NewRestJobCard = RestOf<NewJobCard>;

export type PartialUpdateRestJobCard = RestOf<PartialUpdateJobCard>;

export type EntityResponseType = HttpResponse<IJobCard>;
export type EntityArrayResponseType = HttpResponse<IJobCard[]>;

@Injectable({ providedIn: "root" })
export class JobCardService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(
    ApplicationConfigService
  );

  protected resourceUrl = this.applicationConfigService.getEndpointFor(
    "api/job-cards",
    "operationsmodule"
  );
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor(
    "api/job-cards/_search",
    "operationsmodule"
  );

  create(jobCard: NewJobCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobCard);
    return this.http
      .post<RestJobCard>(this.resourceUrl, copy, { observe: "response" })
      .pipe(map((res) => this.convertResponseFromServer(res)));
  }

  update(jobCard: IJobCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobCard);
    return this.http
      .put<RestJobCard>(
        `${this.resourceUrl}/${this.getJobCardIdentifier(jobCard)}`,
        copy,
        { observe: "response" }
      )
      .pipe(map((res) => this.convertResponseFromServer(res)));
  }

  partialUpdate(jobCard: PartialUpdateJobCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobCard);
    return this.http
      .patch<RestJobCard>(
        `${this.resourceUrl}/${this.getJobCardIdentifier(jobCard)}`,
        copy,
        { observe: "response" }
      )
      .pipe(map((res) => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestJobCard>(`${this.resourceUrl}/${id}`, { observe: "response" })
      .pipe(map((res) => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<
        RestJobCard[]
      >(this.resourceUrl, { params: options, observe: "response" })
      .pipe(map((res) => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<
        RestJobCard[]
      >(this.resourceSearchUrl, { params: options, observe: "response" })
      .pipe(
        map((res) => this.convertResponseArrayFromServer(res)),

        catchError(() =>
          scheduled([new HttpResponse<IJobCard[]>()], asapScheduler)
        )
      );
  }

  getJobCardIdentifier(jobCard: Pick<IJobCard, "id">): number {
    return jobCard.id;
  }

  compareJobCard(
    o1: Pick<IJobCard, "id"> | null,
    o2: Pick<IJobCard, "id"> | null
  ): boolean {
    return o1 && o2
      ? this.getJobCardIdentifier(o1) === this.getJobCardIdentifier(o2)
      : o1 === o2;
  }

  addJobCardToCollectionIfMissing<Type extends Pick<IJobCard, "id">>(
    jobCardCollection: Type[],
    ...jobCardsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobCards: Type[] = jobCardsToCheck.filter(isPresent);
    if (jobCards.length > 0) {
      const jobCardCollectionIdentifiers = jobCardCollection.map(
        (jobCardItem) => this.getJobCardIdentifier(jobCardItem)
      );
      const jobCardsToAdd = jobCards.filter((jobCardItem) => {
        const jobCardIdentifier = this.getJobCardIdentifier(jobCardItem);
        if (jobCardCollectionIdentifiers.includes(jobCardIdentifier)) {
          return false;
        }
        jobCardCollectionIdentifiers.push(jobCardIdentifier);
        return true;
      });
      return [...jobCardsToAdd, ...jobCardCollection];
    }
    return jobCardCollection;
  }

  protected convertDateFromClient<
    T extends IJobCard | NewJobCard | PartialUpdateJobCard,
  >(jobCard: T): RestOf<T> {
    return {
      ...jobCard,
      startDate: jobCard.startDate?.toJSON() ?? null,
      jobCompleteDate: jobCard.jobCompleteDate?.toJSON() ?? null,
      boothDate: jobCard.boothDate?.toJSON() ?? null,
      tinkeringStartDateTime: jobCard.tinkeringStartDateTime?.toJSON() ?? null,
      tinkeringEndDateTime: jobCard.tinkeringEndDateTime?.toJSON() ?? null,
      paintStartDateTime: jobCard.paintStartDateTime?.toJSON() ?? null,
      paintEndDateTime: jobCard.paintEndDateTime?.toJSON() ?? null,
      qcStartDateTime: jobCard.qcStartDateTime?.toJSON() ?? null,
      qcEndDateTime: jobCard.qcEndDateTime?.toJSON() ?? null,
      sparePartStartDateTime: jobCard.sparePartStartDateTime?.toJSON() ?? null,
      sparePartEndDateTime: jobCard.sparePartEndDateTime?.toJSON() ?? null,

      fittingStartDateTime: jobCard.fittingStartDateTime?.toJSON() ?? null,
      fittingEndDateTime: jobCard.fittingEndDateTime?.toJSON() ?? null,
      createdDate: jobCard.createdDate?.toJSON() ?? null,
      lastModifiedDate: jobCard.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restJobCard: RestJobCard): IJobCard {
    return {
      ...restJobCard,
      startDate: restJobCard.startDate
        ? dayjs(restJobCard.startDate)
        : undefined,
      jobCompleteDate: restJobCard.jobCompleteDate
        ? dayjs(restJobCard.jobCompleteDate)
        : undefined,
      boothDate: restJobCard.boothDate
        ? dayjs(restJobCard.boothDate)
        : undefined,
      tinkeringStartDateTime: restJobCard.tinkeringStartDateTime
        ? dayjs(restJobCard.tinkeringStartDateTime)
        : undefined,
      tinkeringEndDateTime: restJobCard.tinkeringEndDateTime
        ? dayjs(restJobCard.tinkeringEndDateTime)
        : undefined,
      paintStartDateTime: restJobCard.paintStartDateTime
        ? dayjs(restJobCard.paintStartDateTime)
        : undefined,
      paintEndDateTime: restJobCard.paintEndDateTime
        ? dayjs(restJobCard.paintEndDateTime)
        : undefined,
      qcStartDateTime: restJobCard.qcStartDateTime
        ? dayjs(restJobCard.qcStartDateTime)
        : undefined,
      qcEndDateTime: restJobCard.qcEndDateTime
        ? dayjs(restJobCard.qcEndDateTime)
        : undefined,
      sparePartStartDateTime: restJobCard.sparePartStartDateTime
        ? dayjs(restJobCard.sparePartStartDateTime)
        : undefined,
      sparePartEndDateTime: restJobCard.sparePartEndDateTime
        ? dayjs(restJobCard.sparePartEndDateTime)
        : undefined,
      fittingStartDateTime: restJobCard.fittingStartDateTime
        ? dayjs(restJobCard.fittingStartDateTime)
        : undefined,
      fittingEndDateTime: restJobCard.fittingEndDateTime
        ? dayjs(restJobCard.fittingEndDateTime)
        : undefined,
      createdDate: restJobCard.createdDate
        ? dayjs(restJobCard.createdDate)
        : undefined,
      lastModifiedDate: restJobCard.lastModifiedDate
        ? dayjs(restJobCard.lastModifiedDate)
        : undefined,
    };
  }

  protected convertResponseFromServer(
    res: HttpResponse<RestJobCard>
  ): HttpResponse<IJobCard> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(
    res: HttpResponse<RestJobCard[]>
  ): HttpResponse<IJobCard[]> {
    return res.clone({
      body: res.body
        ? res.body.map((item) => this.convertDateFromServer(item))
        : null,
    });
  }
}
