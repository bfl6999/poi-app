import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FoursquareService {
  private apiUrl = `${environment.apiUrl}/foursquare`;

  constructor(private http: HttpClient) { }

  search(query: string, city: string, token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('query', query).set('near', city);

    return this.http.get<any[]>(`${this.apiUrl}/search`, { headers, params });
  }

}