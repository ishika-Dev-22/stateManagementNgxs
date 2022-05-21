import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../appModels/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  url: string = 'http://localhost:3000/employees';
  constructor(private http: HttpClient) { }

  addEmployee(emp: Employee):Observable<any>{
    return this.http.post(this.url, emp);
  }

  getEmployeeList(): Observable<any>{
    return this.http.get(this.url);
  }

  getEmployeeById(id: any){
    return this.http.get(this.url+ `/${id}`);
  }

  deleteEmployees(id: any){
    return this.http.delete(`${this.url}/${id}`);
  }

  updateEmployee(emp: Employee): Observable<any>{
    return this.http.put(`${this.url}/${emp._id}`, emp);

  }
}
