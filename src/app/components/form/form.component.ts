import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormDataService } from 'src/app/services/form-data.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  userForm!: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private formService: FormDataService,
    //Injection to get the datable data if any
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<FormComponent>
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.populateForm();
  }

  //Validating the form
  initForm(): void {
    this.userForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}')]],
      phone: ['', Validators.required],
      city: ['', Validators.required],
      street: ['', Validators.required],
      suite: ['', Validators.required]
    });
  }

  //To get the data into the form incase of user edit
  populateForm(): void {
    if (this.data) {
      const { name, email, phone, address } = this.data;
      const { city, street, suite } = address;
      this.userForm.patchValue({
        name,
        email,
        phone,
        city,
        street,
        suite
      });
    }
  }
  //On submit we check if the form is valid and then send the data to a service and then close the popup form
  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      this.formService.setFormData(formData);
      this.dialogRef.close(true);
    }
  }
}
