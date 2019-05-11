import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  email:string;
  password:string;
  name:string;

  message:string;
  user:User;

  form:FormGroup;
  

  constructor(private authService:AuthService, private router:Router,private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name : [this.name],
      email: [this.email, [Validators.email]],
      password : [this.password, [Validators.required]]
    })

    this.authService.isAuthenticated().subscribe(
      response=>{
        this.router.navigate(["main"]);
    });
  }

  login(){
    this.user = {
      email : this.form.get("email").value,
      password: this.form.get("password").value
    };
    this.authService.login(this.user).subscribe(
      response =>{
        this.message = "Logging in Now";
        localStorage.setItem("id", response["id"]);
        localStorage.setItem("user_name", response["name"]);
        var x = setInterval(()=>{
          this.message = this.message + ".."
        },500);
        setTimeout(()=>{
          this.router.navigate(["main"]);
          clearInterval(x);
        },2000);
      },
      err => {
        this.message = "Invalid Credentials or account not created"  
      }
    );
  }

  register(){
    this.user = {
      email : this.form.get("email").value,
      password: this.form.get("password").value,
      name: this.form.get("name").value
    }
    this.authService.register(this.user).subscribe(
      response =>{
        this.message = "Registered. Login Now!"
      },
      err => {
        this.message = "User already exists..."
      }
    );
  }

}
