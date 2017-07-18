
const functions = require('firebase-functions');
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

/**
 * Use entered code for current user, if success will add code cost to users endTime and
 * save it in users used codes
 * @param codeString
 * @param userKey
 * @type {HttpsFunction}
 */
exports.useCode = functions.https.onRequest((req, res) => applyCors(req, res, () => {
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

/**
 * Create code function
 * @param codeString
 * @param codeCost
 * @type {HttpsFunction}
 */
exports.createCode = functions.https.onRequest((req, res) => applyCors(req, res, () => {
  const codeString = req.body.codeString;
  const codeCost = req.body.codeCost;
  return admin.database().ref('/codes/')
    .push({string: codeString, cost: codeCost})
    .then(() => {
      return res.send({
        success: true
      })
    })
    .catch((err) => {
      return res.send({
        success: false,
        error: err,
        errorCode: 1000
      })
    })
}));

/**
 * Change code function
 * @param codeString
 * @param codeCost
 * @param codeKey
 * @type {HttpsFunction}
 */
exports.changeCode = functions.https.onRequest((req, res) => applyCors(req, res, () => {
  const codeString = req.body.codeString;
  const codeCost = req.body.codeCost;
  const codeKey = req.body.codeKey;
  return admin.database().ref('/codes/'+codeKey)
    .update({string: codeString, cost: codeCost})
    .then(() => {
      return res.send({
        success: true
      })
    })
    .catch((err) => {
      return res.send({
        success: false,
        error: err,
        errorCode: 1000
      })
    })
}));

/**
 *
 * @type {HttpsFunction}
 */
exports.deleteCode = functions.https.onRequest((req, res) => applyCors(req, res, () => {
  const codeKey = req.query.key;
  return admin.database().ref('/codes/'+codeKey)
    .remove()
    .then(() => {
      return res.send({
        success: true
      })
    })
    .catch((err) => {
      return res.send({
        success: false,
        error: err,
        errorCode: 1000
      })
    })
}));

