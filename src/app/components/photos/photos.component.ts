import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserIdService } from 'src/app/services/user-id.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  id = 0;
  photos: any;
  user: any;

  constructor(myRoute: ActivatedRoute, private UserDataService: UserDataService, private getUserIdService: UserIdService) {
    this.id = myRoute.snapshot.params["id"];
  }
  ngOnInit(): void {
    //function to get the photos inside an albums of a user
    this.UserDataService.GetPhotosByID(this.id).subscribe({
      next: (data) => { this.photos = data, console.log(this.photos) },
      error: (err) => { console.log(err); },
      complete: () => { console.log("Completed") }
    })
    //function to get the user details
    this.UserDataService.GetUserById(this.getUserIdService.getUserId()).subscribe({
      next: (data) => { this.user = data, console.log(this.user) },
      error: (err) => { console.log(err); },
      complete: () => { console.log("Completed") }
    })
  }
}
