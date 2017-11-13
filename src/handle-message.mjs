import send from './send';
import { parse } from './parser';

//pass off all incoming messages to middleware
export default (server, middlewares) => async (data, socket) => {
  //parse incoming sip message into JS object
  let message = parse(data.toString('binary'));

  //grab middleware for exact sip action, or generic middlewares
  let middlewareForMessage = middlewares.filter(
    middleware => middleware.type === message.type || middleware.type === 'any'
  );

  //run middleware in order of registered and wait for each to complete
  for (let middleware of middlewareForMessage) {
    await middleware.callback({ socket, message }, send(server));
  }
};
