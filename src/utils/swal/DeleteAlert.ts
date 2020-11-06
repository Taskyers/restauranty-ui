import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

export default class DeleteAlert {
    static getDeleteAlert(): Promise<SweetAlertResult<boolean>> {
        return Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        } as SweetAlertOptions);
    }
}
