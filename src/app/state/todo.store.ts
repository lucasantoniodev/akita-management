import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { TodoState } from './todo.state';

export const createInitialState = () => {
  return {
    todos: [],
    isLoaded: true,
  };
};

@Injectable({
  providedIn: 'root',
})
@StoreConfig({
  name: 'todo',
})
export class TodoStore extends Store<TodoState> {
  constructor() {
    super(createInitialState());
  }
}
