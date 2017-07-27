
const functions = require('firebase-functions');

const admin = require('firebase-admin');
const express = require('express');

const cors = require('cors')({origin: true});
const app = express();
app.use(cors);

admin.initializeApp(functions.config().firebase);

function getUserObjectByKeyValue(key, val) {
  return new Promise((res, rej) => {
    const usersRef = admin.database().ref('/users');
    return usersRef.orderByChild(key).equalTo(val).once('value')
      .then((userSnapshot) => {
        let userKey = Object.keys(userSnapshot.val())[0];
        let userObject = userSnapshot.val()[userKey];
        userObject.key = userKey;
        userObject.notificationTokens = userObject.notificationTokens || {};
        userObject.usedCodes = userObject.usedCodes || {};
        return res(userObject);
      }).catch(rej);
  })
}

function getKeyByValue(object, value) {
  for (let key in object) {
    if (object[key] === value)
      return key;
  }
  return false;
}

function getAllValues(object) {
  let values = [];
  for (let key in object) {
    values.push(object[key]);
  }
  return values;
}

app.put('/code', (req, res) => {
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
      return res.status(500).send({
        success: false,
        error: err,
        errorCode: 1000
      })
    })
});

app.put('/user', (req, res) => {
  const endTime = new Date().getTime() + 30 * 60000;
  const role = 'user';
  return admin.database().ref('users')
    .push()
    .set({name: req.body.name, email: req.body.email, endTime: endTime, uid: req.body.uid, role: role})
    .then(() => {
      return res.send({
        success: true
      })
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        error: err,
        errorCode: 1000
      })
    })
});

app.put('/token', (req, res) => {
  const userUid = req.body.userUid;
  const token = req.body.token;
  return getUserObjectByKeyValue('uid', userUid)
    .then((userObject) => {
      let isExist = getKeyByValue(userObject.notificationTokens, token);
      if (userObject.notificationTokens && isExist) {
        return res.send({
          success: false,
          error: 'this token already exist for user',
          errorCode: 1001
        });
      }
      return admin.database().ref('/users')
        .child(userObject.key)
        .child('notificationTokens')
        .push()
        .set(token)
        .then(() => {
          return res.send({
            success: true
          });
        })
        .catch((err) => {
          return res.status(500).send({
            success: false,
            error: err,
            errorCode: 1000
          })
        })
    });
});

app.post('/changeCode', (req, res) => {
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
      return res.status(500).send({
        success: false,
        error: err,
        errorCode: 1000
      })
    })
});

app.post('/changeUserTime', (req, res) => {
  const endTime = req.body.endTime;
  const uid = req.body.userUid;
  return getUserObjectByKeyValue('uid', uid)
    .then((userObject) => {
      return admin.database().ref('/users/' + userObject.key)
        .update({endTime: endTime})
        .then(() => {
          return res.send({
            success: true
          })
        })
        .catch((err) => {
          return res.status(500).send({
            success: false,
            error: err,
            errorCode: 1000
          })
        })
    })
});

app.delete('/code/:key', (req, res) => {
  const codeKey = req.query.key;
  return admin.database().ref('/codes/'+codeKey)
    .remove()
    .then(() => {
      return res.send({
        success: true
      })
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        error: err,
        errorCode: 1000
      })
    })
});


app.delete('/user/:uid', (req, res) => {
  const uid = req.query.uid;
  return getUserObjectByKeyValue('uid', uid)
    .then((userObject) => {
      return admin.database().ref('/users/'+userObject.key)
        .remove()
        .then(() => {
          return res.send({
            success: true
          })
        })
        .catch((err) => {
          return res.status(500).send({
            success: false,
            error: err,
            errorCode: 1000
          })
        })
    })
});

app.post('/sendNotification', (req, res) => {
  const userUid = req.body.userUid;
  const messageText = req.body.messageText;
  const payload = {
    notification: {
      title: "test push notification",
      body: messageText
    }
  };
  let notificationTokens = {};
  let userObject = {};
  return getUserObjectByKeyValue('uid', userUid)
    .then((userResp) => {
      userObject = userResp;
      notificationTokens = getAllValues(userObject.notificationTokens);
      if (!notificationTokens.length) {
        return res.status(500).send({
          success: false,
          error: 'There are no notification tokens to send to.',
          errorCode: 1004
        })
      }
      console.log(notificationTokens);
      return admin.messaging().sendToDevice(notificationTokens, payload)
    })
    .then((response) => {
      console.log("Successfully sent message:", response);
      const tokensToRemove = [];
      response.results.forEach((result, index) => {
        const error = result.error;
        console.log('Error: ', error);
        if (error) {
          console.error('Failure sending notification to ' + notificationTokens[index], error);
          // Cleanup the tokens who are not registered anymore.
          if (error.code === 'messaging/invalid-registration-token' ||
              error.code === 'messaging/registration-token-not-registered') {
            tokensToRemove.push(
              admin.database()
                .ref('/users')
                .child(userObject.key)
                .child('notificationTokens')
                .child(Object.keys(userObject.notificationTokens)[index]) //not sure about this
                .remove()
            );
          }
        }
      });
      return Promise.all(tokensToRemove)
        .then(() => {
          return res.send({
            success: true
          });
        });
    })
    .catch((err) => {
      return res.status(500).send({
        success: false,
        error: err,
        errorCode: 1000
      })
    })
});

/**
 * Use entered code for current user, if success will add code cost to users endTime and
 * save it in users used codes
 * @param codeString
 * @param userKey
 * @type {HttpsFunction}
 */

app.post('/useCode', (req, res) => {
  const codeString = req.body.codeString;
  const userUid = req.body.userUid;
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
      return getUserObjectByKeyValue('uid', userUid)
        .then((userObject) => {
          if (userObject.usedCodes[codeKey]) {
            return res.send({
              success: false,
              errorCode: 1001,
              error: 'Code already used'
            })
          }
          userObject.endTime = userObject.endTime*1 + codeObject[codeKey].cost*1;
          userObject.usedCodes[codeKey] = 'true';
          return admin.database().ref('/users/'+userObject.key).update(userObject)
        })
        .then(() => {
          return res.send({
            success: true
          })
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({
        errorCode: 1000,
        error: err
      })
    })
});


exports.app = functions.https.onRequest(app);
