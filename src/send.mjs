//Converts sip message to a buffer and sends it to a socket. Resolves once sent
import { stringify } from './parser';

export default server => (method, data) =>
  new Promise((resolve, reject) => {
    let text = stringify(method, data);

    server.send(
      new Buffer(text, 'binary'),
      0,
      text.length,
      data.socket.port,
      data.socket.address,
      (error, success) => {
        if (error) return reject(error);
        resolve(data.message);
      }
    );
  });
