import { Injectable } from '@angular/core';
import { Todo } from '../todo.model';
import { Observable } from 'rxjs';
import { TodoState } from './todo.state';
import { Query } from '@datorama/akita';
import { TodoStore } from './todo.store';

@Injectable({
  providedIn: 'root',
})
export class TodoQuery extends Query<TodoState> {
  constructor(protected todoStore: TodoStore) {
    super(todoStore);
  }

  getTodos(): Observable<Todo[]> {
    return this.select((state) => state.todos);
  }

  getLoaded(): Observable<boolean> {
    return this.select((state) => state.isLoaded);
  }

  getLoading(): Observable<boolean> {
    return this.selectLoading();
  }
}
