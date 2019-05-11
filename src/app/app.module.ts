import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { YoutubeService } from './services/youtube.service';
import { SearchListComponent } from './search-list/search-list.component';

import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { Ng5SliderModule } from 'ng5-slider';
import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';

import { ToastrModule } from 'ngx-toastr';
import { NotificationService } from './services/notification.service';

@NgModule({
  declarations: [AppComponent, SearchListComponent, MainComponent, AuthComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    NgxYoutubePlayerModule.forRoot(),
    Ng5SliderModule,
    ToastrModule.forRoot()
  ],
  providers: [YoutubeService,NotificationService],
  bootstrap: [AppComponent]
})
export class AppModule {}
