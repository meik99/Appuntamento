import {FirebaseRepository} from "./firebase.js";
import {Poll, PollState} from "../poll.js";
import * as assert from "assert";

describe("firebase", () => {
    let repo

    before(() => {
        repo = new FirebaseRepository(true)
    })

    it("creates a new poll", function (done) {
        const poll = new Poll()
        console.log(poll.id)
        repo.insert(poll)
            .then(repo.delete(poll.id))
            .then(() => {
                done()
            })
    }).timeout(10000)

    it("finds a poll", async function() {
        const poll = new Poll()

        console.log(poll.id)

        poll.appointments = "test"
        await repo.insert(poll)
        const inserted = await repo.find(poll.id)

        assert.ok(inserted)
        assert.equal(inserted.id, poll.id)
        assert.equal(inserted.appointments, "test")

        await repo.delete(poll.id)
    }).timeout(10000)

    it("deletes a poll", function (done) {
        const poll = new Poll()
        console.log(poll.id)
        repo.insert(poll)
            .then(() => repo.delete(poll.id))
            .then(() => repo.find(poll.id))
            .then((inserted) => {
                assert.equal(inserted, null)
            })
            .then(() => {
                done()
            })
    }).timeout(10000)

    it("updates a poll", async function () {
        const poll = new Poll()

        console.log(poll.id)

        await repo.insert(poll)

        poll.state = PollState.WaitForClose

        await repo.update(poll)

        const updated = await repo.find(poll.id)

        assert.equal(updated.state, PollState.WaitForClose)

        await repo.delete(poll.id)
    }).timeout(100000)
})