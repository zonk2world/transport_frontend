import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Employee } from '../classes/employee';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable()
export class EmployeeService {

  private employeeUrl = `${this.apiEndpoint}/employee`;
  private headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('id_token')});

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject('API_ENDPOINT') private apiEndpoint: string
  ) {
   }

  /** GET Employees from the server */
  getEmployees(network: string = ''): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.employeeUrl, {headers: this.headers, params: {network: network}}).map(response => {
      if(!Array.isArray(response)) response = Object.values(Object.values(response)[0]);
      return response.map(x => {
          return new Employee(x.uid, x.network, x.role, x.name, x.password, x.phone, x.surname, x.username, x.picture);
        });
    });
  }

  /** POST: add a new Employee to the server */
  addEmployee (employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.employeeUrl, employee, {headers: this.headers});
  }

  /** PUT: update the Employee on the server */
  updateEmployee (employee: Employee): Observable<any> {
    return this.http.put<Employee>(this.employeeUrl, employee, {headers: this.headers});
  }

  /** DELETE: delete the Employee from the server */
  deleteEmployee (employee: Employee): Observable<Employee> {
    const uid = typeof employee === 'string' ? employee : employee.uid;
    const url = `${this.employeeUrl}?uid=${uid}`;

    return this.http.delete<Employee>(url, {headers: this.headers});
  }
}
