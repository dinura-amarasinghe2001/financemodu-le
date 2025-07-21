import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, BehaviorSubject, map } from "rxjs";
import { ApplicationConfigService } from "app/core/config/application-config.service";
export interface FileDetails {
  fileName: string; // ✅ Matches backend response
  filePath: string;
  fileSize: number;
}

export interface UploadFileResponse {
  status: string;
  message: string;
  filePaths: FileDetails[]; // ✅ Correct field name
}

@Injectable({
  providedIn: "root",
})
export class GatePassImgService {
  //   private apiUrl = "http://localhost:4200/api/upload";
  private apiUrl = "api/upload";

  protected readonly applicationConfigService = inject(
    ApplicationConfigService
  );

  protected resourceUrl = this.applicationConfigService.getEndpointFor(
    "api/upload",
    "operationsmodule"
  );

  protected resourceUrl2 = this.applicationConfigService.getEndpointFor(
    "api/fileDetails",
    "operationsmodule"
  );

  // Optional BehaviorSubject to hold uploaded images or status
  private uploadedImagesSubject = new BehaviorSubject<any[]>([]);
  uploadedImages$ = this.uploadedImagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Upload a single image
   */
  uploadImages(files: File[]): Observable<UploadFileResponse> {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file); // Name matches MultipartFile[] files in Spring
    }
    return this.http.post<UploadFileResponse>(this.resourceUrl, formData);
  }

  /**
   * Delete image by filename or id (based on your backend setup)
   */
  deleteImage(imageNameOrId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${imageNameOrId}`);
  }

  /**
   * Get uploaded images (optional, depends on backend)
   */
  getUploadedImages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // getImageUrl(fileName: string): string {
  //   // return `${this.resourceUrl2}/${fileName}`;
  //   // return `http://88.223.92.162:8080/services/operationsmodule/api/fileDetails/${fileName}`;
  //   return `/services/operationsmodule/api/fileDetails/${fileName}`;
  // }

  getImageUrl(fileName: string): string {
    // return `http://88.223.92.162:8080/services/operationsmodule/api/fileDetails/${fileName}`;
    return `/services/operationsmodule/api/fileDetails/${fileName}`;
  }

  /**
   * Set uploaded images to observable (optional reactive state)
   */
  setUploadedImages(images: any[]): void {
    this.uploadedImagesSubject.next(images);
  }

  // service method
  getImageWithAuth(url: string): Observable<string> {
    return this.http
      .get(url, {
       
        responseType: "blob",
      })
      .pipe(map((blob) => URL.createObjectURL(blob)));
  }
}
