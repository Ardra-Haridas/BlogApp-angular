import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EditCommunityComponent } from './edit-community/edit-community.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule,EditProfileComponent,EditCommunityComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  modalTitle!: string;
  modalText: any|undefined;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
 
  constructor() {}
 
  ngOnInit() {}
 
  close(event:any) {
      this.closeModal.emit(false);
  }
  onEditSuccess(event:any){
    this.closeModal.emit(event)
  }
}
