
#Diuit-Auth
A library for getting Diuit API sessions. More information in [Diuit API](http://api2.diuit.com)

## Installation

> npm install diuit-auth -S

## Usage

Step 1: Register your Diuit API account [here](http://developer.diuit.com). After logging the dashboard and clicking `Generate Key`, you will get a `.pem` file which includes private key(encryption key), then reloading this page, you would see the private key id (encryption key id).
The contents of pem file should be look like:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAu2L44myhxz/iQmpVzmC6pBLOODkPtLAEMob2xNC9Trb2dZT
w0fPqiOtBbmTZqf1/REd6nxc5i3sMpzmPc0570/GZmu5wK0/FgWlU/pVKX/kAFJ
oxjLmIEWwU4Rn2n5Z5DiXj6Y7K4fDR95cLG6t2dUzvZ7pvjhTp/9g9u+g9ma6Xt
hkUSXnFKr/3sDcdu/lKZ54vnxqBvkteWmlCbpeivBDpUEfwo8SmgKOXoZqNJaKu
7BB6Q3fB614+qTcZo365okaqH1g/icQNZukiAoGAc4tJrMs/5umZ55Fr0t7mp7e
Le3ZcrvbN/0cE4XHB/kaAPAiVWnf+E3V4/LYm
-----END RSA PRIVATE KEY-----
```

Step 2:  To require this module,  and include this code at the top of your code:
```
var DiuitAuth = require('diuit-auth');
```


Step3: Convert your client information as a JsonArray format,  the following code:
```
var client = {
   'appId' : 'YOUR CLIENT APP ID',
   'appKey' : 'YOUR CLIENT APP KEY',
   'encryptionKeyId' : 'YOUR ENCRYPTION KEY ID',
   'encryptionKey' : 'YOUR ENCRYPTION KEY',
   'exp' : SECONDS,
   'platform': ['gcm', 'ios_sandbox', 'ios_production'],
   'userSerial': 'UNIQUE_USER_ID',
   'deviceSerial': 'UNIQUE_DEVICE_ID'
}
```

Step4: Passing the  `client` json to getSession function, the following code :
```
DiuitAuth.getSessionToken(client)
.then(function(res) {
 // res contains session token
})
.catch(function(err) {
 // do something
});
```

Step4: Finally, you can use this session token to access Diuit Chat API
