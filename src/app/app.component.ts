import {Component, OnInit} from '@angular/core';
import {Todo, TodoService} from './todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

  todos: Todo[] = [];
  loading = false;
  todoTitle = '';
  error = '';

  constructor(private todosService: TodoService) {
  }

  ngOnInit(): void {
    this.fetchTodos();
  }

  addTodo(): void {
    if (!this.todoTitle.trim()) {
      return;
    }

    this.todosService.addTodo({
      title: this.todoTitle,
      completed: false
    })
      .subscribe(todo => {
        console.log('TODO', todo);
        // @ts-ignore
        this.todos.push(todo);
        this.todoTitle = '';
      });

  }

  fetchTodos(): void {
    this.loading = true;

    this.todosService.fetchTodos()
      .subscribe(todos => {
        console.log('TODOS', todos);
          // @ts-ignore
        this.todos = todos;
        this.loading = false;
        },
        error => {
          this.error = error.message;
        });
  }

  removeTodo(id: any): void {
    this.todosService.removeTodo(id)
      .subscribe(() => {
        this.todos = this.todos.filter(todo => todo.id !== id);
      });
  }

  completeTodo(id: any): void {
    this.todosService.completeTodo(id)
      .subscribe(todo => {
        // @ts-ignore
        this.todos.find(t => t.id === todo.id).completed = true;
        }
      );
  }
}
