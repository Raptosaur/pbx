import { createServer } from '../src';

let server = createServer();

server.use(async request => {
  console.log(request, 'here is sip data');
});

server.use('REGISTER', async (data, send) => {
  console.log('register called');

  let message = await send(200, data);

  console.log(message);
});
