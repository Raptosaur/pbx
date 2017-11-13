A full blown PBX system. Build scalable phone systems using node. 

Benefits over Askterisk:

- No config files
- Easy api
- Scalable

This system can be database driven, with built in middleware for authentication and local calling. Building a server is just like making an [express](https://expressjs.org) app. How you build on top of this platform is up to you!

## Example registration

```js
import { createServer } from '@encryption/pbx';

let server = createServer();

// all incoming requests
server.use(async request => {
  console.log(request, 'here is sip data');
});

//handle any incoming register requests
server.use('REGISTER', async (data, send) => {
  console.log('register called');

  let message = await send(200, data);

  console.log(message);
});


```

## Coming Soon

```js

//ring multiple phones

send(call([125,101]))

//listen on a call if the number has `2` in front of it
if(message.number === 2205) send(listen(205, data))

//...

//make a conference room prompt and transfer to it
if(message.number !== 1) return

let number = await send(prompt('Please choose a conference room number'))

if(number !== 101) await send(transfer(number))
await send(401, data)
```