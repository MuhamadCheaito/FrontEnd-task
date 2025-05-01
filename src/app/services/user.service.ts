import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

interface GetUsersApiResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
}

export interface User {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })

export class UserService {
  private usersCache: { [key: number]: GetUsersApiResponse } = {};
  private singleUserCache: { [id: number]: User } = {};
  private apiUrl = 'https://reqres.in/api/users';

  constructor(private http: HttpClient) {}

  getUsers(page: number): Observable<GetUsersApiResponse> {
    if(this.usersCache[page]) {
      return new Observable(observer => {
        observer.next(this.usersCache[page]);
        observer.complete();
      })
    }
    else {
      return this.http.get<GetUsersApiResponse>(`${this.apiUrl}?page=${page}`,{
        headers: {
          "x-api-key": "reqres-free-v1"
        }
      }).pipe(tap(res => {
        this.usersCache[page] = res;
      }));
    }
  }
  getSingleUser(id: number): Observable<{ data: User }> {
    if (this.singleUserCache[id]) {
      return of({ data: this.singleUserCache[id] });
    } else {
      return this.http.get<{ data: User }>(`https://reqres.in/api/users/${id}`,{
        headers: {
          "x-api-key": "reqres-free-v1"
        }
      }).pipe(
        tap(response => this.singleUserCache[id] = response.data)
      );
    }
  }
  clearCache (): void {
    this.usersCache = {};
  }
}