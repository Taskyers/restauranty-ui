import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

export default class DangerAlert {

    static getReportAlert(): Promise<SweetAlertResult<boolean>> {
        return this.getAlert('Yes, report');
    }

    static getDeleteAlert(): Promise<SweetAlertResult<boolean>> {
        return this.getAlert('Yes, delete it!');
    }

    private static getAlert(text: string) {
        return Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: text
        } as SweetAlertOptions);
    }

}
