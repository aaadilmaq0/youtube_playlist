import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// const url = "http://localhost:8081";
const url = "http://projectmurmur.us-east-2.elasticbeanstalk.com";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient, private router:Router) { }

  login(user:any){
    return this.http.post(`${url}/login`,user);
  }

  isAuthenticated(){
    return this.http.get(`${url}/isAuthenticated`,{ params :{ "id" : localStorage.getItem("id")}});
  }

  register(user:any){
    return this.http.post(`${url}/register`,user);
  }

  logout(){
    localStorage.removeItem("id");
    this.router.navigate(["login"]);
  }
}
