import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-edit-community',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-community.component.html',
  styleUrl: './edit-community.component.scss'
})
export class EditCommunityComponent {
  @Input() communityDetails:any
  communityprofileForm:FormGroup|any;
  communityid:number|any
  profileCreationSuccess: boolean | any;
  errorMessage:string |any;
  @Output() editSuccessEvent = new EventEmitter<any>()
  constructor(private api:ApiService,private router:Router,private activatedRoute:ActivatedRoute,private fb:FormBuilder){}
  ngOnInit(): void {
    console.log(this.communityDetails);
    
    this.communityprofileForm = this.fb.group({
      communityname:[this.communityDetails.communityname,[]],
      description:[this.communityDetails.description,[]]
    })
  }
  onEditCommunity(){
    const formValues=this.communityprofileForm.getRawValue();
    const userData={
      newCommunityname:formValues.communityname,
      newDescription:formValues.description
    }
    console.log(userData);

    this.api.postReturn(`${environment.BASE_API_URL}/community/updateCommunity/${this.communityDetails.id}`,userData).subscribe((data:any)=>{
      console.log(data);
      this.profileCreationSuccess=true;
      this.editSuccessEvent.emit(true)
     
    },
    (error)=>{
      console.error('Error editing community',error);
      this.errorMessage='Failed to edit community..';
    });
  
}
}
