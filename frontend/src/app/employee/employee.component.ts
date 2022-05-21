import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Employee } from '../appModels/employee.model';
import { AddEmployee, DeleteEmployee, GetEmployee, UpdateEmployee } from '../store/actions/employee.action';
import { EmployeeState } from '../store/state/employee.state';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent implements OnInit, OnDestroy {

  empForm!: FormGroup;
  showModal: boolean = false;
  showDeleteDailog: boolean = false;
  editModal: boolean = false;
  employees: Employee[] = [];
  idToBeDeleted: string = '';
  empLoaded!: Subscription;

  @Select(EmployeeState.getEmployeeList) employees$!: Observable<Employee[]>;
  @Select(EmployeeState.employeeLoaded) employeesLoaded$!: Observable<boolean>;

  constructor(private fb: FormBuilder, private store: Store) { }

  ngOnInit(): void {
    this.getEmployees();
    this.empForm = this.fb.group({
      _id: [],
      name: ['', Validators.required],
      designation: ['', Validators.required],
      department: ['', Validators.required]
    })
  }
  openModal(): void {
    this.showModal = true;
  }

  //Update empoyee details
  onEditEmployee(emp: Employee): void {
    this.showModal = true;
    this.editModal = true;
    this.empForm.patchValue(emp);
  }

  //Confirm Delete employee
  deleteEmployee(id: any): void {
    this.showDeleteDailog = true;
    this.idToBeDeleted = id;
  }

  //Delete employee

  confirmDelete(): void {
    this.store.dispatch(new DeleteEmployee(this.idToBeDeleted));
    this.idToBeDeleted = '';
    // this.empService.deleteEmployees(this.idToBeDeleted).subscribe(
    //   (res) => {
    //     console.log(res);
    //     this.idToBeDeleted = '';
    //     this.getEmployees();
    //   },
    //   (err) => {
    //     console.log(err);
    //   })
  }

  //Form submit
  onEmpSubmit(): void {
    if (this.empForm.valid) {
      if (this.editModal) {
        this.store.dispatch(new UpdateEmployee(this.empForm.value));
        this.editModal = false;
        this.empForm.reset();
        // this.empService.updateEmployee(this.empForm.value).subscribe(
        //   (res) => {
        //     console.log(res);
        //     this.getEmployees();
        //     this.empForm.reset();
        //   },
        //   (err) => {
        //     console.log(err);
        //   })
      } else {
        this.store.dispatch(new AddEmployee(this.empForm.value));
        // console.log(this.empForm.value);
        // this.empService.addEmployee(this.empForm.value).subscribe(
        //   (res) => {
        //     console.log(res);
        //     this.getEmployees();
        //   },
        //   (err) => {
        //     console.log(err);
        //   })

      }
    } else {
      if (this.empForm.hasValidator(this.empForm.value)) {
        console.log("fv");
      }
    }
  }
  getEmployees(): void {
    this.empLoaded = this.employeesLoaded$.subscribe(res=>{
      if(!res){
        this.store.dispatch(new GetEmployee());
      }
    })

    // this.empService.getEmployeeList().subscribe(
    //   (res: any) => {
    //     console.log(res);
    //     this.employees = res;
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // )
  }

  onCloseModal() {
    this.showModal = false;
    this.editModal = false;
    this.empForm.reset();
  }
  ngOnDestroy(): void {
    this.empLoaded.unsubscribe();
  }
}
