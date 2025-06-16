import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Poi } from '../models/poi.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PoiService {
  private apiUrl = `${environment.apiUrl}/pois`;

  constructor(private http: HttpClient) { }

  getAllPOIs(filters: { name?: string; location?: string; date?: string } = {}): Observable<Poi[]> {
    let params = new HttpParams();

    if (filters.name) params = params.set('name', filters.name);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.date) params = params.set('date', filters.date);

    return this.http.get<Poi[]>(this.apiUrl, { params });
  }

  getPOI(id: string): Observable<Poi> {
    return this.http.get<Poi>(`${this.apiUrl}/${id}`);
  }

  addPOI(poi: Poi, token: string): Observable<Poi> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post<Poi>(this.apiUrl, poi, { headers });
  }
  /**addPOI(poi: Poi): Observable<Poi> {
    return this.http.post<Poi>(this.apiUrl, poi);
  }**/

  addComment(poiId: string, comment: { author: string; comment: string; stars: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${poiId}/comments`, comment);
  }

  deletePOI(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
  /**deletePOI(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }**/
  updatePOI(id: string, poi: Poi, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/${id}`, poi, { headers });
  }

  deleteComment(poiId: string, commentId: string, token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${poiId}/comments/${commentId}`, { headers });
  }

  getUserPOIs(userId: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, { headers });
  }
  addMultiplePOIsFromFsqIds(fsqIds: string[], token: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post<any[]>(`${this.apiUrl}/import-foursquare`, { fsqIds }, { headers });
  }
}