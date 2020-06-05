import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
 
 
interface ImageInfo{
  title:string;
  description:string;
  link:string;
}
 
@Injectable({
  providedIn: 'root'
})
 
export class UploadService {
  private url: string = 'https://api.imgur.com/3/image';
  private clientId: string = '0c4c8bc4d89d89d';
  imageLink:any;
 
 
  constructor(private http:HttpClient) { }
  
  async upload(file){
    let formData = new FormData();
    formData.append('image', file.data, file.data.name);
 
    let header = new HttpHeaders({
      "authorization": 'Client-ID '+this.clientId
    });
   
    const imageData = await this.http.post(this.url, formData, {headers:header}).toPromise();
    this.imageLink = imageData['data'].link;
    
 
    return this.imageLink;
 
  }
 
}