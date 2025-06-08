import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FoursquareService {
  private baseUrl = 'https://api.foursquare.com/v3/places/search';
  private apiKey = environment.foursqueareApiKey; // Reemplazar

  constructor(private http: HttpClient) {}

  searchPlaces(query: string, near: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': this.apiKey,
      'Accept': 'application/json'
    });

    const params = new HttpParams()
      .set('query', query)
      .set('near', near)
      .set('limit', 10);

    return this.http.get(this.baseUrl, { headers, params });
  }
}