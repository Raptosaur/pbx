import dgram from 'dgram';
import handleMessage from './handle-message';

export const createServer = (options = {}) => {
  const middlewares = [];

  //create UDP sip server
  const server = dgram.createSocket('udp4').bind(options.port || 5060);

  server.on('message', handleMessage(server, middlewares));

  return {
    use: (type, callback) =>
      middlewares.push({
        type: callback ? type : 'any',
        callback: callback || type,
      }),
  };
};
