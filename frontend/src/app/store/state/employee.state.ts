import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { Employee } from "src/app/appModels/employee.model";
import { EmployeeService } from "src/app/appServices/employee.service";
import { AddEmployee, DeleteEmployee, GetEmployee, UpdateEmployee } from "../actions/employee.action";


//Creating state model
export class EmployeeStateModel {
    employees!: Employee[];
    employeesLoaded!: boolean;
}

@State<EmployeeStateModel>({
    name: 'employees',
    defaults: {
        employees: [],
        employeesLoaded: false
    }
})

@Injectable()
export class EmployeeState {

    constructor(private empService: EmployeeService) { }

    //Selectors has logic to get state data

    //get employee list from state
    @Selector()
    static getEmployeeList(state: EmployeeStateModel) {
        return state.employees
    }

    @Selector()
    static employeeLoaded(state: EmployeeStateModel) {
        return state.employeesLoaded
    }

    @Action(GetEmployee)
    getEmployees({ getState, setState }: StateContext<EmployeeStateModel>) {

        return this.empService.getEmployeeList().pipe(tap(res => {
            const state = getState();
            setState({
                ...state,
                employees: res,
                employeesLoaded: true
            })
        }))
    }

    @Action(AddEmployee)
    addEmployee({ getState, patchState }: StateContext<EmployeeStateModel>, { payload }: AddEmployee) {
        return this.empService.addEmployee(payload).pipe(tap((res) => {
            const state = getState();
            patchState({

                employees: [...state.employees, res]
            })
        }))
    }

    @Action(DeleteEmployee)
    deleteEmployee({ getState, setState }: StateContext<EmployeeStateModel>, { id }: DeleteEmployee) {
        return this.empService.deleteEmployees(id).pipe(tap((res) => {

            const state = getState();
            const filteredEmployees = state.employees.filter(emp => emp._id !== id)
            setState({
                ...state,
                employees: filteredEmployees
            })
        }))
    }

    @Action(UpdateEmployee)
    editEmployee({ getState, patchState }: StateContext<EmployeeStateModel>, { payload }: UpdateEmployee) {
        return this.empService.updateEmployee(payload).pipe(tap((res) => {
            const state = getState();
            const empList = state.employees;
            const index = empList.findIndex(emp => emp._id == payload._id)

            empList[index] = res;

            patchState({
                employees: empList

            })
        }))
    }

}