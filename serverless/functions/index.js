// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');

const cors = require('cors')({origin: true});
admin.initializeApp(functions.config().firebase);

/**
 * Cors middlewire
 * @param req
 * @param res
 * @param fn
 * @return {Promise}
 */
function applyCors(req, res, fn) {
  return new Promise((resolve) => {
    cors(req, res, () => {
      resolve(fn())
    });
  })
}

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original

exports.addUser = functions.https.onRequest((req, res) => {
   // Grab the text parameter.
  const name = req.query.name;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  admin.database().ref('/users').push({name: name}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref);
  });
});

exports.addCode = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const string = req.query.string;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  admin.database().ref('/codes').push({string: string}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref);
  });
});

exports.useCode = functions.https.onRequest((req, res) => applyCors(req, res, () => {
  //эта функция должна принимать ключ кода и юзера, проверять что код раньше не использовался
  // получать стоимость кода, добавлять ее юзеру к финишу и заносить код в использованные для юзера

  const codeString = req.body.codeString;
  const userKey = req.body.userKey;
  return admin.database().ref('codes').orderByChild("string").equalTo(codeString).once('value')
    .then(codeRef => {
      let codeObject = codeRef.val();
      if (!codeObject) {
        return res.send({
          success: false,
          errorCode: 1004,
          error: 'Code not found'
        })
      }
      let codeKey = Object.keys(codeObject)[0];
      return admin.database().ref('/users/'+userKey).once('value')
        .then(userRef => {
          let userObject = userRef.val();
          if (userObject.usedCodes[codeKey]) {
            return res.send({
              success: false,
              errorCode: 1001,
              error: 'Code already used'
            })
          }
          userObject.endTime += codeObject[codeKey].cost;
          userObject.usedCodes[codeKey] = 'true';
          return admin.database().ref('/users/'+userKey).update(userObject)
        })
        .then(() => {
          return res.send({
            success: true
          })
        });
    })
    .catch((err) => {
      console.error(err);
      return res.send({
        success: false,
        errorCode: 1000,
        error: err
      })
    })
}));
