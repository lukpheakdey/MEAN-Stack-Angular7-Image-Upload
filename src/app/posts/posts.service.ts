import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


import { environment } from '../../environments/environment';
//const BACKEND_URL = 'http://localhost:3000/api/posts';
const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router ) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http
      /*
      .get<{ message: string; posts: any, maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      ) */
      .get<{ message: string; posts: any, maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(map((postData) => {
        return {posts: postData.posts.map(post => {
          return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }), maxPosts: postData.maxPosts
        };
      }))
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    /*
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string; creator: string }>(
      'http://localhost:3000/api/posts/' + id
    ); */
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string; creator: string }>(
      BACKEND_URL + id
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      //.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe(responseData => {
        /*
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); */
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    //this.http.put('http://localhost:3000/api/posts/' + id, postData)
    this.http.put(BACKEND_URL + id, postData)
      .subscribe(response => {
        /*
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          title: title,
          content: content,
          imagePath: ''
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]); */
        this.router.navigate(['/']);
      });
  }
  /*
  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  } */
  deletePost(postId: string) {
    //return this.http.delete('http://localhost:3000/api/posts/' + postId);
    return this.http.delete(BACKEND_URL + postId);
  }


}


