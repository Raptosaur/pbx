import dgram from 'dgram';
import send from './send';
import { parse } from './parser';

export const createServer = (options = {}) => {
  const middlewares = [];

  //create UDP sip server
  const server = dgram.createSocket('udp4').bind(options.port || 5060);

  server.on('message', async (data, socket) => {
    //parse incoming sip message into JS object
    let message = parse(data.toString('binary'));

    //grab middleware for exact sip action, or generic middlewares
    let middlewareForMessage = middlewares.filter(
      middleware =>
        middleware.type === message.type || middleware.type === 'any'
    );

    //run middleware in order of registered and wait for each to complete
    for (let middleware of middlewareForMessage) {
      await middleware.callback({ socket, message }, send(server));
    }
  });

  return {
    use: (type, callback) =>
      middlewares.push({
        type: callback ? type : 'any',
        callback: callback || type,
      }),
  };
};
