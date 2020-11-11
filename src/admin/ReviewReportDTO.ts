export class ReviewReportDTO {
    constructor(readonly id: number, readonly user: string, readonly content: string, readonly restaurant: string) {
    }
}
