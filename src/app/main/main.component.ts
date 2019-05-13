import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Host,
  ElementRef
} from "@angular/core";
import { Subscription } from "rxjs";
import { Video } from "../video.model";
import { YoutubeService } from "../services/youtube.service";
import reframe from "reframe.js";
import { AuthService } from "../services/auth.service";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit, OnDestroy {
  selected: string = "Name";
  input: string = "";

  name: string;
  searchResults: string[] = [];
  library: Video[] = [];

  subscription: Subscription;

  showResults: boolean = false;

  startedPlaying: boolean = false;
  canBePaused: boolean = false;
  canBePlayed: boolean = false;

  interval: any;

  loading: string = "";

  public player: YT.Player;
  index = -1;
  @ViewChild("videoContainer") pl: ElementRef;
  constructor(
    private youtubeService: YoutubeService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // console.log(this.pl.nativeElement.offsetWidth);
    this.name = localStorage.getItem("user_name");
    this.subscription = this.youtubeService.getVideos().subscribe(response => {
      if (response["length"]) this.index = 0;
      for (let j = 0; j < response["length"]; j++) {
        this.library.push(response[j]["video"]);
      }
    });
    var tag = document.createElement("script");
    tag.src = "http://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    window["onYouTubeIframeAPIReady"] = e => {
      this.index = 0;
      this.player = null;
    };
  }

  play() {
    if (!this.startedPlaying) {
      this.startedPlaying = true;
      this.index = 0;
      setTimeout(() => {
        this.startVideo(this.index);
      }, 500);
    } else {
      this.player.playVideo();
    }
  }

  pause() {
    this.player.pauseVideo();
  }

  startVideo(i: number) {
    this.loading = "";
    this.player = new YT.Player("player", {
      videoId: this.library[i].id,
      host: "http://www.youtube.com",
      height: this.pl.nativeElement.offsetHeight,
      width: this.pl.nativeElement.offsetWidth,
      events: {
        onStateChange: this.onPlayerStateChange.bind(this),
        onReady: e => {
          this.player.playVideo();
        }
        // 'onError': this.onPlayerError.bind(this),
      },
      playerVars: {
        enablejsapi: 1,
        start: this.library[i].start,
        end: this.library[i].end
      }
    });
    this.interval = setInterval(() => {
      if (this.player != undefined)
        this.player.setSize(
          this.pl.nativeElement.offsetWidth,
          this.pl.nativeElement.offsetHeight
        );
    }, 200);
  }

  clickStartVideo(i: number) {
    if (this.player) {
      this.player.destroy();
      clearInterval(this.interval);
    }
    if (!this.startedPlaying) this.startedPlaying = true;
    var x = setInterval(() => {
      this.loading = this.loading + "..";
    }, 150);
    this.index = i;
    setTimeout(() => {
      this.startVideo(this.index);
      this.loading = "";
      clearInterval(x);
    }, 1000);
  }

  onPlayerStateChange(event: Event) {
    if (event["data"] == 1 || event["data"] == 3) {
      this.canBePaused = true;
    } else {
      this.canBePaused = false;
    }
    if (event["data"] == -1 || event["data"] == 2) {
      this.canBePlayed = true;
    } else {
      this.canBePlayed = false;
    }
    if (event["data"] == 0 && this.index < this.library.length - 1) {
      clearInterval(this.interval);
      this.player.destroy();
      this.index = this.index + 1;
      var x = setInterval(() => {
        this.loading = this.loading + "..";
      }, 150);
      setTimeout(() => {
        this.startVideo(this.index);
        this.loading = "";
        clearInterval(x);
      }, 1000);
    }
    if (event["data"] == 0 && this.index == this.library.length - 1) {
      this.index = 0;
      this.startedPlaying = false;
    }
  }

  // onReady(e):any{
  //   console.log(e);
  // }

  // onPlayerError(event){
  // console.log(event);
  // }

  search() {
    if (!this.input) {
      this.notificationService.showDanger("No Input");
    } else if (this.selected == "Name") {
      this.subscription = this.youtubeService
        .getResultsByName(this.input)
        .subscribe(response => {
          if (!response["items"].length) {
            this.notificationService.showDanger("No results");
          } else {
            response["items"].forEach(item => {
              this.searchResults.push(item["id"]["videoId"]);
              this.showResults = true;
            });
          }
        });
    } else if (this.selected == "Video ID") {
      this.youtubeService.getResultsById(this.input).subscribe(response => {
        if (!response["items"].length) {
          this.notificationService.showDanger("No results");
        } else {
          this.searchResults = [this.input];
          this.showResults = true;
        }
      });
    } else if (this.selected == "Video Link") {
      this.youtubeService.getResultsById(new URL(this.input).searchParams.get("v")).subscribe(response => {
        if (!response["items"].length) {
          this.notificationService.showDanger("No results");
        } else {
          this.searchResults = [new URL(this.input).searchParams.get("v")];
          this.showResults = true;
        }
      });
    } else alert("Wrong Selection");
    console.log(this.searchResults);
  }

  addNewVideo(video: Video) {
    this.library.push(video);
    this.notificationService.showSuccess("Video Added to Playlist");
    console.log(this.library);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
