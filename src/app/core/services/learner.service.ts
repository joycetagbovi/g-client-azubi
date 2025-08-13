import { Injectable } from '@angular/core';
import { Observable, map, catchError,tap } from 'rxjs';
import { ApiService } from './api.service';
import {Learner, AllLearner} from '../../shared/models/models'

@Injectable({ providedIn: 'root' })
export class LearnerService {
    private baseUrl = '/learners';

    constructor(private apiService: ApiService) { }

    getLearners(): Observable<AllLearner[]> {
return this.apiService.get<any>(this.baseUrl).pipe(
            tap(response => {
                const res = response as any      
            }),
            map(res => {
                const response = res as any;
                // Try different ways to access the coursess
                if (response.data?.learners) {
                    return response.data.learners;
                } else if (response.learners) {
                    return response.learners;
                } else if (Array.isArray(response.learners)) {
                    return response.learners
                } else {
                    console.warn('coursesService: Could not find coursess in response:', response);
                    return [];
                }
            }),
            catchError(error => {
                console.error('coursesService: Error fetching coursess:', error);
                throw error;
            })
        );
    }

    getLearnerById(id: string): Observable<AllLearner> {
       return this.apiService.get<any>(`${this.baseUrl}/${id}`).pipe(
               tap(response => {
                    const res = response as any;
                   console.log('leanersService: Fetched courses:', res);  
               }),
       
               map(res => {
                   const response = res as any;
                   if (response.data?.learner) {
                       return response.data.learner;
                   } else  if (response.learner) {
                       return response.learner;
                   }else {
                       console.warn('learersService: Could not find courses in response:', response);
                       throw new Error(response.message || 'courses not found');
                   }
               }),
               catchError(error => {
                   console.error('coursesService: Error fetching courses:', error);
                   throw error;
               })
           );
    }

    addLearner(learner: AllLearner): Observable<AllLearner> {
        return this.apiService.post<AllLearner>(this.baseUrl, learner).pipe(map(res => res.data!));
    }

    updateLearner(id: string, learner: FormData): Observable<AllLearner> {
        return this.apiService.put<AllLearner>(`${this.baseUrl}/${id}`, learner).pipe(map(res => res.data!));
    }

    deleteLearner(id: string): Observable<void> {
        return this.apiService.delete<void>(`${this.baseUrl}/${id}`).pipe(map(() => undefined));
    }
}