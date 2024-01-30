import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { User } from '../../models/data-types';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit{
  @Input() profileDetails:any
  profileForm:FormGroup|any;
  userid: number| any;
  userId:any
  profileCreationSuccess: boolean | any;
  errorMessage:string |any;
  user:any
  @Output() editSuccessEvent = new EventEmitter<any>()

  constructor(private api:ApiService,private router:Router,private activatedRoute:ActivatedRoute,private fb:FormBuilder){}
  ngOnInit(): void {
    console.log(this.profileDetails);
    
    this.profileForm = this.fb.group({
      name:[this.profileDetails.name,[]],
      bio:[this.profileDetails.bio,[]]
    })
  }
  onEdit(){
    const formValues=this.profileForm.getRawValue();
    const userData={
      newname:formValues.name,
      newBio:formValues.bio
    }
    console.log(userData);
    
    if(typeof localStorage !== "undefined" && localStorage.getItem("user")){
      this.user=localStorage.getItem("user")
      this.userId=JSON.parse(this.user).id;
    }
    this.api.postReturn(`${environment.BASE_API_URL}/auth/update/${this.userId}`,userData).subscribe((data:any)=>{
      console.log(data);
      this.profileCreationSuccess=true;
      this.editSuccessEvent.emit(true)
      // this.router.navigate(['/profile'],data);
    },
    (error)=>{
      console.error('Error editing profile',error);
      this.errorMessage='Failed to edit profile..';
    });
  }
}
