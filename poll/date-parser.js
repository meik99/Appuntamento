import moment from "moment/moment.js";

export const parseAppointmentGroups = (appointments) => {
    return appointments.trim().split(",").map(entry => entry.trim())
}

export const parseGroup = (group) => {
    if (group.indexOf("-") > -1) {
        const dates = group.split("-")

        if (dates.length !== 2) {
            return []
        }

        return parseMultipleDates(dates)
    }

    return parseSingleDate(group)
}

export const prepareDateStrings = (dateStrings) => {
    for (let i = 0; i < dateStrings.length; i++) {
        if (dateStrings[i][dateStrings[i].length - 1] !== ".") {
            dateStrings[i] = dateStrings[i] + "."
        }
    }

    return dateStrings
}

export const parseMultipleDates = (dateStrings) => {
    dateStrings = prepareDateStrings(dateStrings)

    const result = []
    const dates = [moment(dateStrings[0], "DD.MM."), moment(dateStrings[1], "DD.MM.")]
    let tmpDate = dates[0]

    while(tmpDate.date() !== dates[1].date() || tmpDate.month() !== dates[1].month()) {
        const date = tmpDate.toDate()

        result.push(`${date.getDate()}.${date.getMonth()}.`)
        tmpDate = moment(tmpDate).add(1, "day")
    }

    const date = tmpDate.toDate()

    result.push(`${date.getDate()}.${date.getMonth()}.`)

    return result
}

export const parseSingleDate = (dateString) => {
    dateString = prepareDateStrings([dateString])[0]

    const date = moment(dateString, "DD.MM.").toDate()
    return [`${date.getDate()}.${date.getMonth()}.`]
}
