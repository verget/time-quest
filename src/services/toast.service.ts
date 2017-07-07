import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  /**
   * function show toast
   * @param type: string; success-toast/error-toast/warning-toast
   * @param message
   */
  showToast(type:string = 'success-toast', message:string) :void {
    let toast = this.toastCtrl.create({
      message: message,
      cssClass: type,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
