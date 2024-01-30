import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { environment } from '../../environments/environment.development';
import { Blog, Community, User } from '../models/data-types';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogComponent } from "../profile/blogdetails/blogdetails.component";
import { HttpHeaders } from '@angular/common/http';
import { DataService } from '../data.service';
import { ModalService } from '../modal.service';

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
communityImage :any
fileImage:any


constructor(private dataService: DataService,private api:ApiService,private modalService:ModalService,private activatedRoute:ActivatedRoute,private router:Router,private viewContainerRef:ViewContainerRef){}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(s => {
      this.communityid=s["communityid"]
    });
    this.api.getReturn(`${environment.BASE_API_URL}/community/communitybyId/${this.communityid}`).subscribe((data)=>{
      this.community=data
      console.log(this.community);
      this.communityImage = "http://localhost:8080/api/v1/community/getCommunityImage/"+this.communityid
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
uploadCommunityImage(event:any) {

  this.fileImage = event.target.files[0];

  if (this.fileImage) {
      const formData = new FormData();
      
      formData.append("imageFile", this.fileImage);

      const headers = new HttpHeaders().set("ResponseType","text")
      this.api.postReturn(`${environment.BASE_API_URL}/community/uploadCommunityImage/${this.communityid}`, formData,{headers}).subscribe((data)=>{
        console.log(data);
        const reader = new FileReader();
        reader.onload = e => this.communityImage = reader.result;
        reader.readAsDataURL(this.fileImage)
        
      },(error)=>{
        console.log(error);
      })
      
  }
}
editCommunityProfile(){
  this.modalService.setRootViewContainerRef(this.viewContainerRef);
   this.modalService.addDynamicComponent("editCommunityProfile", {
     communityname:this.community.communityname,
     description:this.community.description,
     id:this.community.communityid
   }).then((value)=>{
     if(value){
       this.ngOnInit()
     }
   }).catch((error)=>{
     console.log(error);
     
   });
 }
}