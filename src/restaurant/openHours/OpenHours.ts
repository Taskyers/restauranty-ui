import OpenHour from "./OpenHour";

export default class OpenHours {
    constructor(readonly monday?: OpenHour, readonly tuesday?: OpenHour, readonly wednesday?: OpenHour, readonly thursday?: OpenHour, readonly friday?: OpenHour, readonly saturday?: OpenHour, readonly sunday?: OpenHour) {
    }
}
