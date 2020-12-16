var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BNTdDDQ7Lrg4l-IbNplsEuEkuk2NT9BB6KARgxeDsQHKPiAF141MrV7OnRdfzVj0drzAgEwj9L0FGwbWUL-pD2w",
   "privateKey": "6w5i1q_4Hv1BS9_xkHLsuLJVssNAk_MPaHURzJkKmj4"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/elkEjLGO1jQ:APA91bGzP2JbbedSNU3VQ9bXVJsNMB8vYTvubzVBhx_WWtsAj2NspKEKkAIxVOAcp92aT98MYr_yVD9pwhivAc8ZwCl4QpeSNYynDWx6-3nlPlCxI2PDW56PkcfaojXFUdxppj8dF13f",
   "keys": {
       "p256dh": "BIw8zh8WS0sfEGvJzuhEQvXwUgbgdEFoNP+Z+PS3xXJaFBSGszFWM6Fqe2tTvlc4G6MlxxJSM7Mb+/mG5dEuqt4=",
       "auth": "2ZMQCLWWWI+05t2qd+ahug=="
   }
};
var payload = 'Sepakbolaku mengirim anda sebuah notifikasi';
 
var options = {
   gcmAPIKey: '59778261654',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);