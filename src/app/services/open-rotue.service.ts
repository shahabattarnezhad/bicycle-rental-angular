import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OpenRouteService {
    private readonly baseUrl = 'https://api.openrouteservice.org/v2/directions';

    constructor(private http: HttpClient) { }

    getRoute(from: [number, number], to: [number, number], profile: 'cycling-regular' | 'driving-car' | 'foot-walking' = 'cycling-regular'): Observable<any> {
        const body = {
            coordinates: [from, to]
        };

        return this.http.post(
            `${this.baseUrl}/${profile}/geojson`,
            body,
            {
                headers: {
                    Authorization: environment.orsApiKey,
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}
