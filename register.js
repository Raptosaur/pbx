// Simple registrar - redirector with authentication
//

var sip = require('sip');
var digest = require('sip/digest');
var util = require('util');
var os = require('os');

var registry = {
  '125': { password: '1234' },
  '121': { password: '123' },
};

var realm = os.hostname();

function rstring() {
  return Math.floor(Math.random() * 1e6).toString();
}

sip.start(
  {
    logger: {
      send: function(message, address) {
        // debugger;
        util.debug('send\n' + util.inspect(message, false, null));
      },
      recv: function(message, address) {
        // debugger;
        //util.debug('recv\n' + util.inspect(message, false, null));
      },
    },
  },
  function(rq) {
    try {
      if (rq.method === 'SUBSCRIBE') {
        sip.send(sip.makeResponse(rq, 200, 'Ok'));
      } else if (rq.method === 'REGISTER') {
        //looking up user info
        var username = sip.parseUri(rq.headers.to.uri).user;
        var userinfo = registry[username];

        if (!userinfo) {
          // we don't know this user and answer with a challenge to hide this fact
          var session = { realm: realm };
          sip.send(
            digest.challenge(
              { realm: realm },
              sip.makeResponse(rq, 401, 'Authentication Required')
            )
          );
        } else {
          userinfo.session = userinfo.session || { realm: realm };
          if (
            !digest.authenticateRequest(userinfo.session, rq, {
              user: username,
              password: userinfo.password,
            })
          ) {
            sip.send(
              digest.challenge(
                userinfo.session,
                sip.makeResponse(rq, 401, 'Authentication Required')
              )
            );
          } else {
            userinfo.contact = rq.headers.contact;
            var rs = sip.makeResponse(rq, 200, 'Ok');
            rs.headers.contact = [
              {
                ...rq.headers.contact[0],
                params: { ...rq.headers.contact[0].params, expires: 60 },
              },
            ];
            sip.send(rs);
          }
        }
      } else if (rq.method === 'INVITE') {
        var username = sip.parseUri(rq.uri).user;
        var userinfo = registry[username];
        if (
          userinfo &&
          Array.isArray(userinfo.contact) &&
          userinfo.contact.length > 0
        ) {
          sip.send(sip.makeResponse(rq, 100, 'Trying'));
          let rs = { ...rq };
          rs.contact = [{ uri: 'sip:101@10.4.1.22' }];
          sip.send(sip.makeResponse(rs, 180, 'Ringing'));
        } else {
          sip.send(sip.makeResponse(rq, 404, 'Not Found'));
        }
      } else {
        sip.send(sip.makeResponse(rq, 405, 'Method Not Allowed'));
      }
    } catch (e) {
      util.debug(e);
      util.debug(e.stack);

      sip.send(sip.makeResponse(rq, 500, 'Server Internal Error'));
    }
  }
);
