import * as assert from "assert";
import {parseAppointmentGroups, parseGroup} from "./date-parser.js";

const testInput = "1.5.-6.5,8.5.,30.5-4.6."

describe("appointments", () => {
    describe("parseAppointmentGroups", () => {
        it("should parse groups correctly", () => {
            const appointmentGroups = parseAppointmentGroups(testInput)

            assert.equal(appointmentGroups.length, 3)
            assert.equal(appointmentGroups[0], "1.5.-6.5")
            assert.equal(appointmentGroups[1], "8.5.")
            assert.equal(appointmentGroups[2], "30.5-4.6.")
        })
    })

    describe('parseAppointmentGroup', function () {
        it("should get all dates from a group", () => {
            const appointmentGroups = parseAppointmentGroups(testInput)

            let dates = parseGroup(appointmentGroups[0])

            assert.equal(dates.length, 6)

            let date = parseGroup(appointmentGroups[1])

            assert.equal(date.length, 1)

            let overlappingMonth = parseGroup(appointmentGroups[2])

            assert.equal(overlappingMonth.length, 6)

            console.log(appointmentGroups.flatMap(group => parseGroup(group)))
        })
    });
})