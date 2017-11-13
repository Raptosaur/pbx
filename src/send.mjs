//Converts sip message to a buffer and sends it to a socket. Resolves once sent

export default socket => message =>
  new Promise((resolve, reject) =>
    server.send(
      Buffer.from(message),
      0,
      Buffer.byteLength(message),
      socket.port,
      socket.address,
      err => {
        if (err) return reject(error);
        resolve();
      }
    )
  );
