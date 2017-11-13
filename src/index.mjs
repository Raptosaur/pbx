import dgram from 'dgram';

export const createServer = (options = {}) => {
  const middleware = [];

  const methods = {
    use: callback => middleware.push(callback),
  };
  const server = dgram.createSocket('udp4').bind(options.port || 5060);

  const actions = socket => ({
    send: message =>
      new Promise((resolve, reject) => server.send(
        Buffer.from(message),
        0,
        Buffer.byteLength(message),
        socket.port,
        socket.address,
        (err) => {
          if(err) return reject(error)
          resolve()
        }
      ),
  });

  server.on('message', (data, socket) => {
    let text = data.toString('binary');
    middleware.forEach(middleware => middleware(text, actions(socket)));
  });

  return methods;
};
