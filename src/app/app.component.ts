import { Component, ElementRef, signal, input, output, viewChild, computed, linkedSignal, effect, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from "./home/home.component";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare global {
  var apiKey: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule, HomeComponent, CommonModule],  
  template: `
  <h1 #h1el>Angular v19</h1>
  <input #myinput [(ngModel)]="name"/>
  <input [(ngModel)]="userId"/>

  @let nameInputVar = "Hello " +  myinput.value;

  <p>{{nameInputVar}}</p>  

  @let user = user$ | async;
  <p>{{user.username}}</p>
  <button (click)="method()">call method</button>
  <!-- <p>{{value()}}</p> -->
  <!-- <p>{{fullNameLinked()}}</p> -->
  <app-home [userId]="userId()"></app-home>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  name = signal<string>(""); 
  userId = signal<number>(1);
  user$!: Observable<any>;

  fullName = computed(()=> {
    //işlemler
    return "Bay " + this.name();
  });

  // fullNameLinked = linkedSignal(()=> {
  //   //işlemler
  //   return "Bay " + this.name();
  // })

  // fullNameLinked = linkedSignal({
  //   source: this.name,
  //   computation: ((newVersion, prevVersion)=>{
  //     console.log("New Version: " + newVersion);
  //     console.log("Old Version: " + prevVersion?.value);
  //     return "... " + this.name();
  //   })
  // })
  
  readonly value = input<string>("");
  readonly event = output<string>();
  readonly h1el = viewChild.required<ElementRef<HTMLHeadingElement>>("h1el");

  constructor(private injector: Injector, private http: HttpClient){

      this.user$ = this.http.get("https://jsonplaceholder.typicode.com/users/3");

    //console.log("Api key: " + apiKey);
    //this.fullNameLinked.set("Deneme");   
    //this.value.set("Test"); //set edilemez
  }

  method(){
    effect(()=> {
      if(this.userId()){
        console.log("detecting some changes in user Id...");
      }      
    },{injector: this.injector})

    effect(()=> {
      if(this.name()){
        console.log("detecting some changes in name...");        
      }
    },{injector: this.injector})
  }
}
