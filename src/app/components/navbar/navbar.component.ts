import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../api.service';
import { environment } from '../../../environments/environment.development';
import { User } from '../../models/data-types';
import { DataService } from '../../data.service';
import { log } from 'console';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{
  
  user:any
  username:any
 users: User[] |any;
 userId:any
 userProfile:any
  constructor(private api :ApiService,private router:Router,private dataService:DataService){} 
  ngOnInit(): void {
    this.dataService.notifyObservable$.subscribe((res)=>{
      if(res){
        const reader = new FileReader();
        reader.onload = e => this.userProfile = reader.result;
        reader.readAsDataURL(res)
      }
    })
    this.router.events.subscribe((value:any)=>{
      if(value.url){
        if(typeof localStorage !== "undefined" && localStorage.getItem("user")){
          this.user=localStorage.getItem("user")
          this.username=JSON.parse(this.user).name;
          this.userId=JSON.parse(this.user).id;
          this.userProfile = `${environment.BASE_API_URL}/auth/getImage/${this.userId}`
        }else{
          this.username=null
        }
      }
    })
  }
  logout() {
    this.api.getReturn(`${environment.BASE_API_URL}/auth/logout`).subscribe((data:any)=>{
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      this.router.navigate(['/'])
    },(error)=>{
      console.log(error);
    })
    }
    profileDetails(id:any){
      console.log(id);
      
      this.router.navigate(['/profile',id]);
    }
}