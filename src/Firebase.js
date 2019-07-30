import { DB_CONFIG } from "./config";
import firebase from "firebase";

class Firebase {
    constructor() {
        if (!firebase.apps.length)
            this.app = firebase.initializeApp(DB_CONFIG);

        this.db = firebase.firestore();
    }

    getDocument(collection, id, callback) {
        this.db.collection(collection).doc(id).get().then((doc) => {
            callback(doc.data());
        });
    }

    getCollection(collection, callback) {
        this.db.collection(collection).get().then(snap => {
            let newCollection = [];
            snap.forEach(x => newCollection.push({ ...x.data(), id: x.id }));
            callback(newCollection);
        });
    }

    addDocument(collection, doc, callback) {
        this.db.collection(collection).add(doc).then(docRef => {
            callback(docRef.id);
        });
    }

    editDocument(collection, id, doc) {
        this.db.collection(collection).doc(id).update(doc);
    }

    deleteDocument(collection, id, callback) {
        this.db.collection(collection).doc(id).delete().then(() => {
            callback();
        });
    }

    deleteSquad(id, callback) {
        this.getDocument("squads", id, (squad) => {
            squad.tasks.forEach(docRef => {
                this.deleteDocument("tasks", docRef.id, () => 0);
            });
            this.deleteDocument("squads", id, callback);
        });
    }
}

const instance = new Firebase();
Object.freeze(instance);

export default instance;