import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { environment } from '../../../environments/environment.development';
import { Blog, Community } from '../../models/data-types';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  communityForm:FormGroup|any;
  blogs:Blog[] | any;
  communityCreationSuccess: boolean | any;
  errorMessage:string |any;
  communityList: Community[] |any
  user:string|any
  userId: number|any;
  communityid: number| any;
  nocommunityList:any
  showcreate:boolean=false;
  fileImage:any
  communityImage:any
  constructor(private api:ApiService,private router:Router,private activatedRoute:ActivatedRoute,private fb:FormBuilder){}
  ngOnInit(): void {
    this.communityImage='https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
    this.api.getReturn(`${environment.BASE_API_URL}/post/blogs`).subscribe((data:any)=>{
      this.blogs = data
      console.log(this.blogs);
      
    },(error)=>{
      console.log(error);
      
    });
    this.user=localStorage.getItem("user")
    this.userId=JSON.parse(this.user).id;
    this.api.getReturn(`${environment.BASE_API_URL}/community/unjoinedCommunity/${this.userId}`).subscribe((data:any)=>{
      this.nocommunityList=data
      console.log(this.nocommunityList);
    },(error)=>{
      console.log(error);
    }
    );
    this.user=localStorage.getItem("user")
    this.userId=JSON.parse(this.user).id;
    this.api.getReturn(`${environment.BASE_API_URL}/community/joinedCommunities/${this.userId}`).subscribe((data:any)=>{
      this.communityList=data
      console.log(this.communityList);
    },(error)=>{
      console.log(error);
    }
    );
    this.activatedRoute.params.subscribe(s=>{
      this.communityid=s["communityid"]
    });
    this.communityForm=this.fb.group({
      communityname:['',Validators.required],
      description:['',Validators.required],
      profilepic:['',Validators.required]
    });
    this.communityImage = "http://localhost:8080/api/v1/community/getCommunityImage/"+this.communityid
    console.log(this.fileImage);

  }
  onCreate(){
    const formValues=this.communityForm.getRawValue();
    const userData={
      communityname:formValues.communityname,
      description:formValues.description,
      userid:this.userId
    }
    console.log(userData);
    this.api.postReturn(`${environment.BASE_API_URL}/community/create`,userData).subscribe((data:any)=>{
      console.log(data);
      if(this.fileImage){
        const formData = new FormData();
        formData.append("imageFile", this.fileImage);    
        const headers = new HttpHeaders().set("ResponseType","text")
        this.api.postReturn(`${environment.BASE_API_URL}/community/uploadCommunityImage/${data.communityid}`, formData,{headers}).subscribe((data)=>{
          console.log(data);
        },(error)=>{
          console.log(error);
        })
      }
      this.communityCreationSuccess=true;
      this.router.navigate([`/community/${data.communityid}`])

    },
    (error)=>{
      console.error('Error creating Community',error);
      this.errorMessage='Failed to create community.Please try again..';
    })
  }
  goToBlogDetails(id:any){
    this.router.navigate(['/blog',id]);
  }
  togglecreate():void{
    this.showcreate=!this.showcreate;
  }
  selectImage(event:any) {
    this.fileImage = event.target.files[0];
    if (this.fileImage) {
          const reader = new FileReader();
          reader.onload = e => this.communityImage = reader.result;
          reader.readAsDataURL(this.fileImage)
    }
  }
}


