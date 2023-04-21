import {initializeApp, applicationDefault, cert} from 'firebase-admin/app';
import {getFirestore} from "firebase-admin/firestore";
import * as path from "path";
import {Poll} from "../poll.js";

export class FirebaseRepository {
    app = null

    constructor(local = false) {
        if (local) {
            this.app = initializeApp({
                credential: cert(path.relative(process.cwd(), "./poll/repository/credentials.json")),
            })
        } else {
            this.app = initializeApp()
        }
    }

    insert = async (poll) => {
        const db = getFirestore(this.app)
        const pollRef = db.collection("polls").doc(poll.id)

        await pollRef.set(JSON.parse(JSON.stringify(poll)))
    }

    find = async (pollId) => {
        const db = getFirestore(this.app)
        const pollRef = db.collection("polls").doc(pollId)
        const pollSnapshot = await pollRef.get()

        if (pollSnapshot.exists) {
            return Object.assign(new Poll(), pollSnapshot.data())
        }

        return null
    }

    delete = async (pollId) => {
        const db = getFirestore(this.app)
        const pollRef = db.collection("polls").doc(pollId)

        await pollRef.delete()
    }

    update = async (poll) => {
        const db = getFirestore(this.app)
        const pollRef = db.collection("polls").doc(poll.id)

        await pollRef.update(JSON.parse(JSON.stringify(poll)))
    }
}


