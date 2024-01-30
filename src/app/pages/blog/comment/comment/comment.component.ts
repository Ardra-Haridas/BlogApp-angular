import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../api.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { DataService } from '../../../../data.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent implements OnInit {
  @Input() comment: any;
  @Input() allComments: any[] = [];
  @Input() postid: number | any;
  commentCreationSuccess: boolean | any;
  errorMessage: string | any;
  user: string | any;
  userId: any;
  commentid: number | any;
  isCommentLiked:boolean = false
  isEdit: boolean = false;
  editCommentId: any;
  isReplyOpened: boolean = false;
  replyUser: string = '';
  replyComment: string = '';
  parentMessageId: any;

  constructor(private api: ApiService, private router: Router,private dataService: DataService) {}
  ngOnInit(): void {
    this.user = localStorage.getItem('user');
    if (this.user) this.userId = JSON.parse(this.user).id;
    this.isCommentLiked = this.comment.isLiked
  }

  likeComment(commentid: number): void {
    const headers = new HttpHeaders().set('ResponseType', 'text');
    this.api
      .postReturn(
        `${environment.BASE_API_URL}/like/likeComment/${commentid}/${this.userId}`,
        null,
        { headers }
      )
      .subscribe(
        (response) => {
          this.isCommentLiked = true
        },
        (error) => {
          console.log('error liking comment', error);
        }
        );
        
        this.api
        .postReturn(
          `${environment.BASE_API_URL}/like/unlikeComment/${commentid}/${this.userId}`,
          null,
          { headers }
          )
          .subscribe(
            (response: any) => {
              if (response) {
            this.isCommentLiked = false            
          }
        },
        (error) => {
          console.log('error unliking comment', error);
        }
      );
  }
  editcomment(comment: any) {
    this.dataService.notifyOther({
      action:"edit",
      data:comment
    })
  }

  deletecomment(commentId: any): void {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this comment?'
    );
    if (shouldDelete) {
      this.api
        .deleteReturn(
          `${environment.BASE_API_URL}/comment/deleteComment/${commentId}`
        )
        .subscribe(
          (data) => {
            console.log('deleted Post Successfully', data);
          },
          (error) => {
            console.log('error deleting post', error);
          }
        );
    }
  }
  replycomment(comment: any) {
    this.dataService.notifyOther({
      action:"reply",
      data:comment
    })
  }
  getReplies(parentcommentid: number): any[] {
    return this.allComments.filter((obj) => {
      return obj.parentcommentid == parentcommentid;
    });
  }
}
