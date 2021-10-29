import moment from "moment"

export const apptFinishTime = (startTime, duration) => {
    return moment(startTime, 'h:mma').add(duration,'minutes').format('LT')


}