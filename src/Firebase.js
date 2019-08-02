import { DB_CONFIG } from "./config";
import firebase from "firebase";

class Firebase {
  constructor() {
    if (!firebase.apps.length) this.app = firebase.initializeApp(DB_CONFIG);

    this.db = firebase.firestore();
  }

  getDocument(collection, id) {
    return this.db
      .collection(collection)
      .doc(id)
      .get();
  }

  getCollection(collection) {
    return this.db.collection(collection).get();
  }

  addDocument(collection, doc) {
    return this.db.collection(collection).add(doc);
  }

  editDocument(collection, id, doc) {
    return this.db
      .collection(collection)
      .doc(id)
      .update(doc);
  }

  deleteDocument(collection, id) {
    return this.db
      .collection(collection)
      .doc(id)
      .delete();
  }
}

const instance = new Firebase();
Object.freeze(instance);

export default instance;
