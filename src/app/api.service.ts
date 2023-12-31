import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  
  constructor(private http:HttpClient) {}
    postReturn(apiUrl: string, requestBody:any | null, options?:any ){
      return this.http.post(apiUrl,requestBody,options);
    }
    getReturn(apiUrl: string,options?:any){
      return this.http.get(apiUrl);
    }

    deleteReturn(apiUrl:string,options?:any){
      return this.http.delete(apiUrl);
    }
   
}
