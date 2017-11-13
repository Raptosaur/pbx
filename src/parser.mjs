//Converts a sip message into an object
export const parse = message => {
  let [type, ...rest] = message.split(' ');
  let parts = message.split(/\n/);

  let data = parts
    .filter(line => line.split(': ')[1] && line.split(': ')[0])
    .reduce((data, part) => {
      let [name, value] = part.split(': ');
      return { ...data, [name]: value.replace('\r', '') };
    }, {});

  return {
    type,
    ...data,
  };
};

const methods = {
  '200': '200 OK',
  '401': '401 Authentication Required',
};

export const stringify = (method, { message }) => {
  let text = Object.keys(message)
    .filter(key => key !== 'type')
    .map(key => `${key}: ${message[key]}`)
    .reduce((string, current) => `${string}\n${current}\r`);

  console.log(`SIP/2.0 ${methods[method]}\n${text}`);

  return `SIP/2.0 ${methods[method]}\n${text}`;
};
