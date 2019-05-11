import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message) {
    this.toastr.success(message,'', {
      timeOut : 1000,
      positionClass: 'toast-bottom-right'
    });
  }

  showDanger(message){
    this.toastr.warning(message,'',{
      timeOut : 1000,
      positionClass: 'toast-bottom-right'
    });
  }
}
