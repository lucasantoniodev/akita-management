import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoStore } from '../state/todo.store';
import { ApiService } from '../state/todo.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.scss'],
})
export class AddTodoComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private apiService: ApiService,
    private todoStore: TodoStore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });
  }

  addTodo() {
    this.apiService
      .addTodo(
        this.form.controls['title'].value,
        this.form.controls['description'].value
      )
      .subscribe({
        next: (response) => {
          this.todoStore.update((state) => {
            return {
              todos: [...state.todos, response],
              isLoaded: true,
            };
          });
        },
        error: (err) => {
          console.log(err);
          this.todoStore.setError(err);
        },
        complete: () => {
          this.todoStore.setLoading(false);
          this.router.navigateByUrl('');
        },
      });
  }
}
