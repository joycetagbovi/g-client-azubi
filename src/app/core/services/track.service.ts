import { Injectable } from '@angular/core';
import { Observable, map, tap, catchError } from 'rxjs';
import { ApiService, ApiResponse } from './api.service';
import { Track, TrackFormDto } from '../../shared/models/models';

interface TracksApiResponse {
    success: boolean;
    count: number;
    tracks: Track[];
}

@Injectable({ providedIn: 'root' })
export class TrackService {
    private baseUrl = '/tracks';

    constructor(private apiService: ApiService) { }

    getTracks(): Observable<Track[]> {
        return this.apiService.get<any>(this.baseUrl).pipe(
            tap(response => {
                const res = response as any;
                console.log('TrackService: Raw API response:', res);
           
            }),
            map(res => {
                const response = res as any;
                // Try different ways to access the tracks
                if (response.data?.tracks) {
                    return response.data.tracks;
                } else if (response.tracks) {
                    return response.tracks;
                } else if (Array.isArray(response.data)) {
                    return response.data;
                } else {
                    console.warn('TrackService: Could not find tracks in response:', response);
                    return [];
                }
            }),
            catchError(error => {
                console.error('TrackService: Error fetching tracks:', error);
                throw error;
            })
        );
    }

    getTrackById(id: string): Observable<Track> {
        return this.apiService.get<Track>(`${this.baseUrl}/${id}`).pipe(
        tap(response => {
             const res = response as any;
            console.log('TrackService: Fetched track:', res);  
        }),

        map(res => {
            const response = res as any;
            if (response.data?.track) {
                return response.data.track;
            } else  if (response.track) {
                return response.track;
            }else {
                console.warn('TrackService: Could not find track in response:', response);
                throw new Error(response.message || 'Track not found');
            }
        }),
        catchError(error => {
            console.error('TrackService: Error fetching track:', error);
            throw error;
        })
    );
    }

    addTrack(track: FormData): Observable<Track> {
        return this.apiService.post<Track>(this.baseUrl, track).pipe(map(res => res.data!));
    }

    updateTrack(id: string, track: FormData): Observable<Track> {
        return this.apiService.put<Track>(`${this.baseUrl}/${id}`, track).pipe(map(res => res.data!));
    }

    deleteTrack(id: string): Observable<void> {
        return this.apiService.delete<void>(`${this.baseUrl}/${id}`).pipe(map(() => undefined));
    }


    getRatingsByTrackId(trackId: string): Observable<Track['ratings']> {
        return this.apiService.get<{ ratings: Track['ratings'] }>(`${this.baseUrl}/${trackId}/ratings`).pipe(
            map(res => res.data?.ratings || []),
            catchError(error => {
                console.error('TrackService: Error fetching ratings:', error);
                throw error;
            })
        );
    }
}