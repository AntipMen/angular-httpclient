import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, delay, map, tap} from 'rxjs/operators';

export interface Todo {
  completed: boolean;
  title: string;
  id?: number;
}

@Injectable({
  providedIn: 'root'
})

export class TodoService {

  constructor(private http: HttpClient) {}

  addTodo(todo: Todo): Observable<Todo> {

    const headers = new HttpHeaders({
      MyCustomHeader: Math.random().toString(),
    });

    return this.http.post<Todo>('https://jsonplaceholder.typicode.com/todos', todo, {
      headers
    });
  }

  fetchTodos(): Observable<HttpResponse<Todo[]> | null> {

    let params = new HttpParams();
    params = params.append('_limit', '4');

    params = params.append('custom', 'anything');

    return this.http.get<HttpResponse<Todo[]>>('https://jsonplaceholder.typicode.com/todos', {
      // params: new HttpParams().set('_limit', '3')
      params,
      observe: 'response'
    })
      .pipe(
        map(response => {
          // console.log('response', response)
          return response.body;
        }),
        delay(500),
        catchError(error => {
          console.log('Error:', error.message);
          return throwError(error);
        } ));
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete<void>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      observe: 'events'
    }).pipe(
      tap(event => {
        console.log('event', event);
        if (event.type === HttpEventType.Sent) {
          console.log('sent', event);
        }
        if (event.type === HttpEventType.Response) {
          console.log('Response', event);
        }
      })
    );
  }

  completeTodo(id: number): Observable<any> {
    return this.http.put<Todo>(`https://jsonplaceholder.typicode.com/todos/${id}`, {
      completed: true
    }, {
      responseType: 'json'
    });
  }
}
