import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroqService {
  private apiUrl = `${environment.apiUrl}/groq`;

  constructor(private http: HttpClient) {}

  generateRoute(city: string, pois: any[], token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/generate`, { city, pois }, { headers });
  }
}
