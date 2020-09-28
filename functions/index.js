const functions = require("firebase-functions");
const Filter = require("bad-words"); // built-in package
const admin = require("firebase-admin");
admin.initializeApp();
// note that this line below should be declared after admin.initializeApp()
const db = admin.firestore();

exports.detectEvilUsers = functions.firestore
  .document("messages/{msgId}")
  .onCreate(async (doc, ctx) => {
    // as soon as the message is created, we check for the bad-words
    const filter = new Filter();
    const { text, uid } = doc.data();
    if (filter.isProfane(text)) {
      const cleaned = filter.clean(text);
      // updating the text of the user after cleaning/removing bad words
      await doc.ref.update({
        text: `🤐 I got banned for life for saying ... ${cleaned}`,
      });
      // this creates a new doc in banned collection and since we don't need any fields inside the uid object we just leave it blank {}
      await db.collection("banned").doc(uid).set({});
    }
  });
