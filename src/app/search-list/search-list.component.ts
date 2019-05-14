import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter
} from "@angular/core";
import { Video } from "../video.model";
import { YoutubeService } from "../services/youtube.service";
import { Subscription } from "rxjs";
import { Options, LabelType } from "ng5-slider";
@Component({
  selector: "app-search-list",
  templateUrl: "./search-list.component.html",
  styleUrls: ["./search-list.component.scss"]
})
export class SearchListComponent implements OnInit, OnDestroy {
  @Input() searchResults: string[];
  @Input() library: Video[];

  @Output() newVideo = new EventEmitter<Video>();
  videos: Video[] = [];
  options: Options[] = [];
  subscriptions: Subscription[] = [];
  constructor(private youtubeService: YoutubeService) {}

  async ngOnInit() {
    await this.searchResults.forEach(item => {
      this.subscriptions.push(
        this.youtubeService.getResultsById(item).subscribe(response => {
          let h = this.findHours(
            response["items"][0]["contentDetails"]["duration"].substring(2)
          );
          let m = this.findMinutes(
            response["items"][0]["contentDetails"]["duration"].substring(2)
          );
          let s = this.findSeconds(
            response["items"][0]["contentDetails"]["duration"].substring(2)
          );
          this.options.push({
            floor: 0,
            ceil: h * 3600 + m * 60 + s,
            translate: (value: number, label: LabelType): string => {
              switch (label) {
                case LabelType.Low:
                  return "Start - " + this.convert(value);
                case LabelType.High:
                  return "End - " + this.convert(value);
                default:
                  return `${this.convert(value)}`;
              }
            }
          });
          this.videos.push({
            id: item,
            title: response["items"][0]["snippet"]["title"],
            thumbnail:
              response["items"][0]["snippet"]["thumbnails"]["medium"]["url"],
            hours: h,
            minutes: m,
            seconds: s,
            channel: response["items"][0]["snippet"]["channelTitle"],
            start: 0,
            end: h * 3600 + m * 60 + s,
            views : response["items"][0]["statistics"]["viewCount"]
          });
        })
      );
    });
    console.log(this.videos);
  }

  convert(value: number): string {
    var d = Number(value);
    var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    var hDisplay = h > 0 ? h + ":" : "";
    var mDisplay = m > 0 ? m + ":" : "0:";
    var sDisplay = s > 0 ? s : "0";

    return hDisplay + mDisplay + sDisplay;
  }

  findHours(s: string): number {
    if (s.indexOf("H") == -1) return 0;
    return parseInt(s.substring(0, s.indexOf("H")));
  }

  findMinutes(s: string): number {
    if (s.indexOf("M") == -1)
     return 0;
    else{
      if(s.indexOf("H")==-1)
        return parseInt(s.substring(0, s.indexOf("M")));
      else 
        return parseInt(s.substring(s.indexOf("H")+1, s.indexOf("M")));
    }
  }
  findSeconds(s: string): number {
    if (s.indexOf("S") == -1)
     return 0;
    else if(s.indexOf("M")!=-1)
      return parseInt(s.substring(s.indexOf("M")+1, s.indexOf("S")));
    else if(s.indexOf("H")!=-1)
      return parseInt(s.substring(s.indexOf("H")+1, s.indexOf("S")));
    else
    return parseInt(s.substring(0, s.indexOf("S")));
  }

  add(i: number) {
    if (this.library.findIndex(video => video.id == this.videos[i].id) != -1) {
      alert("Video Exists!");
    } else {
      this.newVideo.emit(this.videos[i]);
      this.youtubeService.addVideo(this.videos[i]).subscribe(response => {
        console.log(response);
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
