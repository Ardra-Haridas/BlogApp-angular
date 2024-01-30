import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../api.service';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { error } from 'console';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { response } from 'express';
import { AnyTxtRecord } from 'dns';
import { CommentComponent } from './comment/comment.component';
import { DataService } from '../../../data.service';

@Component({
  selector: 'app-comment-area',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule,CommentComponent],
  templateUrl: './comment-area.component.html',
  styleUrl: './comment-area.component.scss'
})
export class CommentAreaComponent implements OnInit{

comment: any;
allComments:any[]=[]
showcomments: boolean=false;
@Input() comments:Comment|any
newComment:string='';
  @Input() postid: number|any;
commentForm: FormGroup | any;
commentCreationSuccess: boolean | any;
errorMessage:string |any;
  user: string | any;
  userId: any;
commentid: number|any;

isEdit:boolean=false
editCommentId:any
isReplyOpened:boolean = false
replyUser:string=""
replyComment:string=""
parentMessageId:any

constructor(private api:ApiService,private router:Router,private fb:FormBuilder,private dataService:DataService){
}
ngOnInit(): void {
  this.dataService.notifyObservable$.subscribe((res)=>{
    if(res.action == "edit"){
      this.isEdit=true
      this.commentForm=this.fb.group({
        content:[res.data.content,Validators.required]
      });
      this.editCommentId=res.data.commentid
    }
  })
  this.dataService.notifyObservable$.subscribe((res)=>{
    if(res.action == "reply"){
      this.replyUser = res.data.name;
      this.replyComment = res.data.content;
      this.parentMessageId = res.data.commentid;
      this.isReplyOpened = true;
    }
  })
  this.user=localStorage.getItem("user")
    if(this.user)
      this.userId=JSON.parse(this.user).id;
  this.api.getReturn(`${environment.BASE_API_URL}/comment/commentsByPostId/${this.postid}`).subscribe((data:any)=>{
    this.allComments = data
    console.log(this.allComments);
    
    this.comments=data.filter((obj:any)=>{
      return obj.parentcommentid == null
    })
    console.log(this.allComments);
  },(error)=>{
    console.log(error);
  })
  this.commentForm=this.fb.group({
    content:['',Validators.required]
  });
  this.isReplyOpened = false
  this.parentMessageId = null
  
}
  addComment():void {
    

const formValues=this.commentForm.getRawValue();
const userData={
  userid:this.userId,
  postid:this.postid,
  content:formValues.content,
  parentcommentid:this.parentMessageId ? this.parentMessageId : null
 
}
console.log(userData);
const headers = new HttpHeaders().set("ResponseType","text")
this.api.postReturn(`${environment.BASE_API_URL}/comment/createComment`,userData,{headers}).subscribe((data:any)=>{
  console.log(data);
  this.commentCreationSuccess=true;
  this.ngOnInit()

},
(error)=>{
  console.error('Error creating comment:',error);
  this.errorMessage='Failed to create comment.Please try again..';
})
  }
  onEdit(){
      
    const formValues=this.commentForm.getRawValue();
    const userData={
      content:formValues.content,
     
    }
    const headers = new HttpHeaders().set("ResponseType","text")
    this.api.postReturn(`${environment.BASE_API_URL}/comment/update/${this.editCommentId}`,userData,{headers}).subscribe((data:any)=>{
      console.log(data);
      this.commentCreationSuccess=true;
      this.ngOnInit()
    
    },
    (error)=>{
      console.error('Error editing comment:',error);
      this.errorMessage='Failed to edit comment.Please try again..';
    });
    
        }
  
      closeReply(){
        this.parentMessageId = null
        this.isReplyOpened=false
      }
      
  }

