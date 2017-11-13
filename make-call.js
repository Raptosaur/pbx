// Initiating a call example. Note: we use bogus sdp, so no real rtp session will be established.

var sip = require('sip');
var util = require('util');
var os = require('os');

var dialogs = {};

function rstring() {
  return Math.floor(Math.random() * 1e6).toString();
}
const users = {};
//starting stack
sip.start(
  {
    address: '0.0.0.0',
    port: 5060,
    logger: {
      send: function(message, address) {
        console.error('send', message);
      },
      recv: function(message, address) {
        console.error('receive', message);
      },
    },
  },
  function(rq, remote) {
    if (rq.method === 'REGISTER') {
      var user = sip.parseUri(rq.headers.to.uri).user;

      users[user] = rq.headers.contact;
      var rs = sip.makeResponse(rq, 200, 'Ok');
      rs.headers.to.tag = Math.floor(Math.random() * 1e6);

      sip.send(rs);
    }
  }
);

// Making the call

// sip.send(
//   {
//     method: 'INVITE',
//     uri: process.argv[2],
//     headers: {
//       to: { uri: process.argv[2] },
//       from: { uri: 'sip:test@test', params: { tag: rstring() } },
//       'call-id': rstring(),
//       cseq: { method: 'INVITE', seq: Math.floor(Math.random() * 1e5) },
//       'content-type': 'application/sdp',
//       contact: [{ uri: 'sip:101@' + os.hostname() }], // if your call doesnt get in-dialog request, maybe os.hostname() isn't resolving in your ip address
//     },
//     content:
//       'v=0\r\n' +
//       'o=- 13374 13374 IN IP4 172.16.2.2\r\n' +
//       's=-\r\n' +
//       'c=IN IP4 172.16.2.2\r\n' +
//       't=0 0\r\n' +
//       'm=audio 16424 RTP/AVP 0 8 101\r\n' +
//       'a=rtpmap:0 PCMU/8000\r\n' +
//       'a=rtpmap:8 PCMA/8000\r\n' +
//       'a=rtpmap:101 telephone-event/8000\r\n' +
//       'a=fmtp:101 0-15\r\n' +
//       'a=ptime:30\r\n' +
//       'a=sendrecv\r\n',
//   },
//   function(rs) {
//     if (rs.status >= 300) {
//       console.log('call failed with status ' + rs.status);
//     } else if (rs.status < 200) {
//       console.log('call progress status ' + rs.status);
//     } else {
//       // yes we can get multiple 2xx response with different tags
//       console.log('call answered with tag ' + rs.headers.to.params.tag);

//       // sending ACK
//       sip.send({
//         method: 'ACK',
//         uri: rs.headers.contact[0].uri,
//         headers: {
//           to: rs.headers.to,
//           from: rs.headers.from,
//           'call-id': rs.headers['call-id'],
//           cseq: { method: 'ACK', seq: rs.headers.cseq.seq },
//           via: [],
//         },
//       });

//       var id = [
//         rs.headers['call-id'],
//         rs.headers.from.params.tag,
//         rs.headers.to.params.tag,
//       ].join(':');

//       // registring our 'dialog' which is just function to process in-dialog requests
//       if (!dialogs[id]) {
//         dialogs[id] = function(rq) {
//           if (rq.method === 'BYE') {
//             console.log('call received bye');

//             delete dialogs[id];

//             sip.send(sip.makeResponse(rq, 200, 'Ok'));
//           } else {
//             sip.send(sip.makeResponse(rq, 405, 'Method not allowed'));
//           }
//         };
//       }
//     }
//   }
// );
