import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserIdService } from 'src/app/services/user-id.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  id = 0;
  user: any;
  albums: any;
  photosCount: number = 0;
  constructor(myRoute: ActivatedRoute, private UserDataService: UserDataService, private setUserIdService: UserIdService) {
    this.id = myRoute.snapshot.params["id"]
  }
  ngOnInit(): void {
    //function to get the user details for the user
    this.UserDataService.GetUserById(this.id).subscribe({
      next: (data) => { this.user = data; },
      error: (err) => { console.log(err); },
      complete: () => {
        console.log("GetUserById complete");
      }
    })
    //Function to get the albums of each user
    this.UserDataService.GetAlbumsById(this.id).subscribe({
      next: (data) => { this.albums = data; },
      error: (err) => { console.log(err); },
      complete: () => { console.log("GetAlbumsById complete"); }
    })
    //This is to get the user id  so that in the Photos page we can view the user details
    this.setUserIdService.setUserId(this.id)
    //Function to get the number of photos for each album (its not correct it should be the albumId's ID and do for loop on them i guess)
    this.UserDataService.GetPhotosByID(this.id).subscribe({
      next: (data) => { this.photosCount = data.length, console.log(data) },
      error: (err) => { console.log(err); },
      complete: () => { console.log("Completed") }
    });
  }
}
