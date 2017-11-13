import dgram from 'dgram';
import send from './send';

export const createServer = (options = {}) => {
  const middleware = [];

  const server = dgram.createSocket('udp4').bind(options.port || 5060);

  server.on('message', (data, socket) => {
    let text = data.toString('binary');
    middleware.forEach(middleware => middleware(text, send(socket)));
  });

  return {
    use: callback => middleware.push(callback),
  };
};
