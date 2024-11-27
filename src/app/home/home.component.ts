import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, inject, input, resource, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { lastValueFrom } from "rxjs";

@Component({
  selector: 'app-home',
  imports:[FormsModule],
  template: `
  <h1>Home Component</h1>
  <p>{{data.isLoading() ? 'Yükleniyor...' : 'Yüklendi'}}</p>
  <input type="text" [(ngModel)]="userId2">
  @if(!data.isLoading() && data.error() === undefined){
    <p>{{data.value().name}}</p>
    <p>{{data.value().username}}</p>
    <p>{{data.value().email}}</p>
  }
  @if(data.error()){
    <p>Error: {{showError()}}</p>
  }
  `,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  userId = input.required<number>();
  userId2 = signal<number>(1);
  #http = inject(HttpClient);

  data = resource({
    request: this.userId2,
    loader: async ({request: id}) => {
      //işlemler
      await new Promise((res)=> setTimeout(res, 1000));
      const result = await lastValueFrom(this.#http.get<any>(`https://jsonplaceholder.typicode.com/users/${id}`));
      return result;
    }
  })

  showError(){
   return (this.data.error() as HttpErrorResponse).message;
  }
}
