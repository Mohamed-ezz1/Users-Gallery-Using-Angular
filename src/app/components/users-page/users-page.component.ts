import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import { UserDataService } from 'src/app/services/user-data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormDataService } from 'src/app/services/form-data.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css']
})
//private dialog: MatDialog to open the popup
export class UsersPageComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'phone', 'address', 'edit', 'delete'];
  dataSource!: MatTableDataSource<any>;

  //Both of those from angular material for the paging and sorting
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //we injected MatDialog in the constructor for the popup, and UserDataService to get the users data
  //Form data service is to get the data from the popup when we add or edit
  constructor(
    private dialog: MatDialog,
    private userDataService: UserDataService,
    private formDataService: FormDataService,
    private snackBar: MatSnackBar) { }
  users: any;

  ngOnInit(): void {
    this.getUsersData();
  }
  //Function to get users data and put them into the table
  getUsersData() {
    this.userDataService.GetAllUsers().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('Get all Users completed');
      }
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(FormComponent);
    //After close will show the data from the form into the table
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const formData = this.formDataService.getFormData();
        if (formData) {
          // Generate a unique ID for the new user
          const newUserId = this.dataSource.data.length + 1;
          // Create a new user object
          const newUser = {
            id: newUserId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: {
              suite: formData.suite,
              street: formData.street,
              city: formData.city
            }
          };
          // Add the new user to the table
          this.dataSource.data.push(newUser);
          this.dataSource._updateChangeSubscription();
          // Show success message
          this.showSnackBar('User added successfully');
        }
      }
    });
  }

  deleteUser(userId: number): void {
    const userToDelete = this.dataSource.data.find(user => user.id === userId);
    if (userToDelete) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: 'Are you sure you want to delete this user?'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dataSource.data = this.dataSource.data.filter(user => user.id !== userId);
          this.showSnackBar('User deleted successfully');
        }
      });
    }
  }

  //Snack bar for alert messages
  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  //Function to edit the users
  editUser(data: any) {
    //First we open the popup form , and retrieve the data of the user
    const dialogRef = this.dialog.open(FormComponent, {
      data,
    });
    //After close we get the form data via service and we update the user based on his ID
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const formData = this.formDataService.getFormData();
        if (formData) {
          // Update the user data in the table
          const userToUpdate = this.dataSource.data.find(user => user.id === data.id);
          if (userToUpdate) {
            userToUpdate.name = formData.name;
            userToUpdate.email = formData.email;
            userToUpdate.phone = formData.phone;
            userToUpdate.address = {
              ...userToUpdate.address,
              city: formData.city,
              street: formData.street,
              suite: formData.suite
            };
            this.dataSource._updateChangeSubscription();
          }
          this.showSnackBar('User updated successfully');
        }
      }
    });
  }

  //From angular material (function for the search bar)
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

