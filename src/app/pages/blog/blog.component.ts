import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { environment } from '../../../environments/environment.development';
import { ActivatedRoute } from '@angular/router';
import { error, log } from 'console';
import { Blog } from '../../models/data-types';;
import { HttpHeaders } from '@angular/common/http';
import { CommentAreaComponent } from './comment/comment-area.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule,CommentAreaComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit{
  blogId:number|any
  blogDetails:Blog|any
  blog: any;
  blogs: any;
  user:string|any
  userId: number|any;
  likeFlag:boolean|any = false
showComments: boolean = false;
userProfile:any
  constructor(private api:ApiService,private activatedRoute: ActivatedRoute){}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(s => {
      this.blogId=s["id"]
    });
    this.api.getReturn(`${environment.BASE_API_URL}/post/findbyId/${this.blogId}`).subscribe((data)=>{
      this.blogDetails=data
      this.userProfile =  `${environment.BASE_API_URL}/auth/getImage/${this.blogDetails.user.id}`
      console.log(this.blogDetails);
      this.user=localStorage.getItem("user")
      this.userId=JSON.parse(this.user).id;
      this.api.getReturn(`${environment.BASE_API_URL}/like/likebyuser/${this.userId}/${this.blogId}`).subscribe((data)=>{
        console.log(data);
        if(data!=0){
          this.likeFlag = true
        }
      })
      
    },(error)=>{
      console.log(error);
      
    })
  }

  likepost():void{
    this.user=localStorage.getItem("user")
    this.userId=JSON.parse(this.user).id;
    if(!this.likeFlag){
      this.api.postReturn(`${environment.BASE_API_URL}/like/likePost/${this.blogId}/${this.userId}` ,null).subscribe(
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
      this.api.postReturn(`${environment.BASE_API_URL}/like/unlikePost/${this.blogId}/${this.userId}` ,null,{headers}).subscribe(
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
 toggleComments():void{
  this.showComments=!this.showComments;
 }
 
}
