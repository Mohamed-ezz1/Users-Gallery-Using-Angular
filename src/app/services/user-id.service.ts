import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserIdService {
  userId: any;

  constructor() { }
  getUserId() {
    return this.userId;
  }

  setUserId(id: any) {
    this.userId = id;
    console.log(this.userId);
  }
}
