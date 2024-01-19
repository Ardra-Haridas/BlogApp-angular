import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { error, log } from 'console';
import { Blog, User } from '../models/data-types';
import { Router, RouterModule } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { BlogComponent } from './blogdetails/blogdetails.component';
import { DataService } from '../data.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterModule,BlogComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  [x: string]: any;
  userid:number|any;
  username:string| any;
email:any;
bio: string|any;
blogDetails:Blog[]|any=[]
users:User[] |any;
user:string|any
currentuserid:number |any
  likeFlag:boolean|any = false
  fileName:any
  profilePic:any
  fileImage:any
  userDetails:any
constructor(private dataService: DataService,private api:ApiService,private activatedRoute:ActivatedRoute,private router:Router){}
ngOnInit(): void {
  this.activatedRoute.params.subscribe(s => {
    this.userid=s["id"]
  });
  if(typeof localStorage !== "undefined" && localStorage.getItem("user")){
    this.user=localStorage.getItem("user")
      this.currentuserid=JSON.parse(this.user).id;
    }
    console.log(this.userid,this.currentuserid);
    
  this.getUserDetails()
}
getUserDetails(){
  this.api.getReturn(`${environment.BASE_API_URL}/auth/userbyId/${this.userid}`).subscribe((data)=>{
    this.users=data
    this.profilePic=`${environment.BASE_API_URL}/auth/getImage/${this.userid}`
    console.log(this.profilePic);
    
    this.fetchUserBlogPost()
  },(error)=>{
    console.log(error);
  });
}
fetchUserBlogPost() {
  // if(typeof localStorage !== "undefined" && localStorage.getItem("user")){
  // this.user=localStorage.getItem("user")
  //   this.userid=JSON.parse(this.user).id;
  // }else{
  //   this.userid=null
  // }
  if (this.users && this.users.id) {
    this.api.getReturn(`${environment.BASE_API_URL}/auth/${this.users.id}/blogposts`).subscribe(
      (blogpost) => {
        console.log("User Blog Post:", blogpost);
        this.blogDetails = blogpost;
      },
      (error) => {
        console.log("Error fetching blog posts", error);
      }
    );
  }
}
likepost(blogId:number):void{
  this.user=localStorage.getItem("user")
  this.userid=JSON.parse(this.user).id;
  if(!this.likeFlag){
    this.api.postReturn(`${environment.BASE_API_URL}/like/likePost/${blogId}/${this.currentuserid}` ,null).subscribe(
      (response)=>{
        this.blogDetails.likes++;
        this.likeFlag = true
      },
      (error)=>{
        console.log('error liking post',error);
      }
  )
  }else{
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/like/unlikePost/${blogId}/${this.currentuserid}` ,null,{headers}).subscribe(
      (response:any)=>{
        if(response=="success"){
          this.blogDetails.likes--;
          this.likeFlag = false
        }
      },
      (error)=>{
        console.log('error unliking post',error);
      }
  )
  }
  
}
uploadImage(event:any) {

  this.fileImage = event.target.files[0];

  if (this.fileImage) {
      const formData = new FormData();
      
      formData.append("imageFile", this.fileImage);

      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/auth/uploadImage/${this.currentuserid}`, formData,{headers}).subscribe((data)=>{
        console.log(data);
        const reader = new FileReader();
        reader.onload = e => this.profilePic = reader.result;
        reader.readAsDataURL(this.fileImage)
        this.dataService.notifyOther(this.fileImage)
      },(error)=>{
        console.log(error);
      })
      
  }
}


}
