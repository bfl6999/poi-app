import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PoiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllPOIs() {
    return this.http.get(`${this.apiUrl}/pois`);
  }

  getPOI(id: string) {
    return this.http.get(`${this.apiUrl}/pois/${id}`);
  }

  addPOI(poi: any) {
    return this.http.post(`${this.apiUrl}/pois`, poi);
  }

  addComment(poiId: string, comment: any) {
    return this.http.post(`${this.apiUrl}/pois/${poiId}/comments`, comment);
  }

  deletePOI(id: string) {
    return this.http.delete(`${this.apiUrl}/pois/${id}`);
  }
}