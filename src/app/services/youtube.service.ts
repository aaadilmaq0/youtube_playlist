import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

const googleurl: string = "https://www.googleapis.com/youtube/v3";
const apiKey: string = "AIzaSyArnDh15sbxOLBdqmiBj4KBAGs-sgfLhxA";
const part: string = "snippet";
const type: string = "video";
const maxResults: number = 25;

// const url = "http://localhost:8081";
const url = "http://projectmurmur.us-east-2.elasticbeanstalk.com";

@Injectable({
  providedIn: "root"
})
export class YoutubeService {
  constructor(public http: HttpClient) {}

  getResultsByName(q:string) {
    return this.http.get(`${googleurl}/search?key=${apiKey}&part=${part}&type=${type}&maxResults=${maxResults}&q=${q}`);
  }
  getResultsById(id:string) {
    return this.http.get(`${googleurl}/videos?key=${apiKey}&part=${part}%2CcontentDetails%2Cstatistics&id=${id}`)
  }

  addVideo(video:any){
    return this.http.post(`${url}/addVideo`,video,{ params : {"id": localStorage.getItem("id")}});
  }

  getVideos(){
    return this.http.get(`${url}/getVideos`,{ params :{ "id" : localStorage.getItem("id")}});
  }

}
