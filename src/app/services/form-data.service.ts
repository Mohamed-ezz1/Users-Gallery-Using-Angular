import { Injectable } from '@angular/core';
import { count } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//This is basically a setter and getter service that gets the data from the form component
//then sets the data in the user component
export class FormDataService {
  formData: any = null;
  constructor() { }
  setFormData(data: any) {
    this.formData = data;
  }

  getFormData() {
    return this.formData;
  }
}

