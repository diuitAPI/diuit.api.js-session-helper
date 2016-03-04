var _ = require('lodash');
var rp = require('request-promise');
var jws = require('jws');
var moment = require('moment');
var Promise = require('bluebird');
var Validator = require('./lib/client-validator');
var err;

var clientSafeFields = ['appId', 'appKey', 'encryptionKeyId', 'encryptionKey', 'userSerial' , 'deviceSerial', 'platform', 'devicePushToken', 'exp'];

var DiuitAuth = {

    getSessionToken : function(params) {

        return new Promise(function(resolve, reject) {

            var client = new Validator(params, clientSafeFields);

            client.checkBody('appId').notEmpty().isAlpha();
            client.checkBody('appKey').notEmpty().isAlpha();
            client.checkBody('encryptionKeyId').notEmpty().isAlpha();
            client.checkBody('encryptionKey').notEmpty().isAlpha();
            client.checkBody('userSerial').notEmpty().isAlpha();
            client.checkBody('deviceSerial').notEmpty().isAlpha();
            client.checkBody('platform').notEmpty().isAlpha().isSupportedDevicePlatform();
            // validator.checkBody('devicePushToken').optional().isAlpha();
            client.checkBody('exp').notEmpty().isNum();

            if(err = client.validationErrors()) {
                reject(err);
            }
            else {

                var headers = {
                    "x-diuit-application-id": client.appId,
                    "x-diuit-app-key": client.appKey
                };

                rp({ // first, get server nonce
                  method: 'GET',
                  uri: 'https://api.diuit.net/1/auth/nonce',
                  headers: headers,
                  json: true
                }).then(function(resp) {
                  return rp({ // then, create a jwt certificate with the subject information
                    method: 'POST',
                    uri: 'https://api.diuit.net/1/auth/login',
                    headers: headers,
                    body: {
                      jwt: jws.sign({
                        header: {
                          typ: 'JWT', // the payload is JWT format
                          alg: 'RS256', // sign using rs256 algorithm
                          cty: 'diuit-auth;v=1', // content type, use our diuit-auth entication content-type, version 1
                          kid: client.encryptionKeyId  // which key is used for encryption (you can have multiple keys, this is for server to know which key to use to decrypt this certificate)
                        },
                        payload: {
                          iss: client.appId, // issuer, who issue this certificate, in this case, the client yourself
                          sub: client.userSerial, // subject, who is granted access in this certificate, in this case, the user who is trying to login
                          iat: moment().format().toString(), // issue at, when the certificate is issued at
                          exp: moment().add(client.exp, 'seconds').format().toString(), // expired, when the certification will expire
                          nonce: resp.nonce // nonce, the server nonce, to prevent replay attack
                        },
                        privateKey: client.encryptionKey // the key used for encrypting the certificate
                      }),
                      deviceId: client.deviceSerial, // when login, also need to provide the device that is loggining in
                      platform: client.platform //
                    },
                    json: true
                  });

                }).then(function(resp) {
                  // console.log(resp);
                  resolve({status: 'ok', session: resp.session});
                }).catch(function(err) {
                  // console.log(err)
                  reject(err);
                });
            }
        });
    }
};


module.exports = DiuitAuth;
