import { createServer } from '../src';

let server = createServer();

server.use(async request => {
  console.log(request, 'here is sip data');
});

server.use(async (request, actions) => {
  await actions.send();
});
