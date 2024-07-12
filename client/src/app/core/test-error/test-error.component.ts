import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {environment} from 'src/environments/environment'
@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent {
  baseUrl = environment.apiUrl;
  validationErrors : string[] = [];

  constructor(private http : HttpClient){
    console.log(this.validationErrors.length);
  }

  get404Error(){
    this.http.get(this.baseUrl + "products/42").subscribe({
      next : reponse => console.log(Response),
      error : error => console.log(error)
    })
  }
  get500Error(){
    this.http.get(this.baseUrl + "buggy/servererror").subscribe({
      next : reponse => console.log(Response),
      error : error => console.log(error)
    })
  }
  get400Error(){
    this.http.get(this.baseUrl + "buggy/badrequest").subscribe({
      next : reponse => console.log(Response),
      error : error => console.log(error)
    })
  }
  get400ValidationError(){
    this.http.get(this.baseUrl + "products/fortytwo").subscribe({
      next : reponse => console.log(Response),
      error : error => {
        this.validationErrors = error.errors;
      }
    })
  }


}
