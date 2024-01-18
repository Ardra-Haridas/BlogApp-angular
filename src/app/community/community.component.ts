import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { environment } from '../../environments/environment.development';
import { Blog, Community, User } from '../models/data-types';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogComponent } from "../profile/blogdetails/blogdetails.component";
import { HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-community',
    standalone: true,
    templateUrl: './community.component.html',
    styleUrl: './community.component.scss',
    imports: [CommonModule, RouterModule, BlogComponent]
})
export class CommunityComponent implements OnInit {

error:string |null=null;
userid:number|any;
communityid:number|any
communityname:string|any
description:string|any
 community:Community[]|any
blogDetails:Blog[]| any;
users:User[] |any;
user:string|any
userId: number|any;
joinFlag:boolean|any = false


constructor(private api:ApiService,private activatedRoute:ActivatedRoute,private router:Router){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(s => {
      this.communityid=s["communityid"]
    });
    this.api.getReturn(`${environment.BASE_API_URL}/community/communitybyId/${this.communityid}`).subscribe((data)=>{
      this.community=data
      console.log(this.community);
      this.fetchUserBlogPost(this.communityid)
      this.checkIfUserJoined();
    },(error)=>{
      console.log(error);
    }
    );
}
fetchUserBlogPost(communityid:number):void {
 
  if(typeof localStorage !== "undefined" && localStorage.getItem("user")){
  this.user=localStorage.getItem("user")
    this.userid=JSON.parse(this.user).id;
  }else{
    this.userid=null
  }
  if (communityid) {
    this.api.getReturn(`${environment.BASE_API_URL}/community/${communityid}/posts`).subscribe(
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
createCommunityBlog()
{
  this.router.navigate([`/createblog/${this.communityid}`])
}
joincommunity(communityid:number):void {
 this.user=localStorage.getItem("user")
 this.userId=JSON.parse(this.user).id;
 if(!this.joinFlag){
  const headers=new HttpHeaders().set("ResponseType","text")
  this.api.postReturn(`${environment.BASE_API_URL}/community/join/${this.userId}/${this.communityid}` ,null,{headers}).subscribe(
    (response)=>{
      this.joinFlag = true;
    },
    (error)=>{
      console.log('error joining community',error);
    }
  );
  
 }
else{
   const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/community/unjoin/${this.userId}/${this.communityid}` ,null,{headers}).subscribe(
        (response:any)=>{
            this.joinFlag = false
        },
        (error)=>{
          console.log('error unjoining community',error);
        }
    )
}
}
private checkIfUserJoined(): void {
  if (this.userid && this.communityid) {
    this.user=localStorage.getItem("user")
      this.userId=JSON.parse(this.user).id;
    this.api.getReturn(`${environment.BASE_API_URL}/community/joineduser/${this.userId}/${this.communityid}`).subscribe((response: any) => {
      console.log(response);
      if(response == 0){
        this.joinFlag = false
      }else{
        this.joinFlag = true
      }
        console.log(this.joinFlag);
        
      });
  }
}

}