import { TodoQuery } from './../state/todo.query';
import { ApiService } from './../state/todo.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Todo, TodoStatus } from '../todo.model';
import { filter, switchMap, take, lastValueFrom } from 'rxjs';
import { TodoStore } from '../state/todo.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  loading = false;
  todos: Todo[] = [];

  constructor(
    private router: Router,
    private todoStore: TodoStore,
    private todoQuery: TodoQuery,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // <===== Store status =====>
    this.todoQuery.getLoading().subscribe((res) => (this.loading = res));

    // <===== Load initial state =====>
    this.todoQuery.getTodos().subscribe((res) => {
      this.todos = res;
    });

    // <===== Load only with loaded status =====>
    this.todoQuery
      .getLoaded()
      .pipe(
        take(1),
        filter((res) => !res),
        switchMap(() => {
          this.todoStore.setLoading(true);
          return this.apiService.getTodos();
        })
      )
      .subscribe(
        (res) => {
          this.todoStore.update((stdate) => {
            return {
              todos: res,
              isLoaded: true,
            };
          });
          this.todoStore.setLoading(false);
        },
        (err) => {
          console.log(err);
          this.todoStore.setLoading(false);
        }
      );
  }

  addTodo() {
    this.router.navigateByUrl('/add-todo');
  }

  markAsComplete(id: string) {
    this.apiService.updateTodo(id, { status: TodoStatus.DONE }).subscribe({
      next: (res) => {
        this.todoStore.update((state) => {
          const todos = [...state.todos];
          const index = todos.findIndex((t) => t.id === id);
          todos[index] = {
            ...todos[index],
            status: TodoStatus.DONE,
          };

          return {
            ...state,
            todos,
          };
        });
      },
      error: (err) => console.log(err),
    });
  }

  deleteTodo(id: string) {
    this.apiService.deleteTodo(id).subscribe({
      next: (response) => {
        this.todoStore.update((state) => {
          return {
            ...state,
            todos: state.todos.filter((t) => t.id !== id),
          };
        });
      },
    });
  }
}
