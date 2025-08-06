import { Injectable } from '@angular/core';
import { Observable, map, catchError, tap } from 'rxjs';
import { ApiService } from './api.service';
import { Course, CourseFormDto } from '../../shared/models/models';



@Injectable({ providedIn: 'root' })
export class CourseService {
    private baseUrl = '/courses';

    constructor(private apiService: ApiService) { }

    getCourses(): Observable<Course[]> {
 return this.apiService.get<any>(this.baseUrl).pipe(
            tap(response => {
                const res = response as any;
                // console.log('coursesService: Raw API response:', res);
           
            }),
            map(res => {
                const response = res as any;
                // Try different ways to access the coursess
                if (response.data?.courses) {
                    return response.data.courses;
                } else if (response.courses) {
                    return response.courses;
                } else if (Array.isArray(response.courses)) {
                    return response.courses
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

    getCourseById(id: string): Observable<Course> {
 return this.apiService.get<Course>(`${this.baseUrl}/${id}`).pipe(
        tap(response => {
             const res = response as any;
            console.log('coursesService: Fetched courses:', res);  
        }),

        map(res => {
            const response = res as any;
            if (response.data?.courses) {
                return response.data.courses;
            } else  if (response.courses) {
                return response.courses;
            }else {
                console.warn('coursesService: Could not find courses in response:', response);
                throw new Error(response.message || 'courses not found');
            }
        }),
        catchError(error => {
            console.error('coursesService: Error fetching courses:', error);
            throw error;
        })
    );
    }

    addCourse(course: FormData): Observable<Course> {
        return this.apiService.post<Course>(this.baseUrl, course).pipe(map(res => res.data!));
    }

    updateCourse(id: string, course: FormData): Observable<Course> {
        return this.apiService.put<Course>(`${this.baseUrl}/${id}`, course).pipe(map(res => res.data!));
    }

    deleteCourse(id: string): Observable<void> {
        return this.apiService.delete<void>(`${this.baseUrl}/${id}`).pipe(map(() => undefined));
    }
}