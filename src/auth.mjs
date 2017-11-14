import crypto from 'crypto';
import os from 'os';

const hash = crypto.createHash('md5');
const secretKey = process.env.PBX_SECRET_KEY;
const realm = os.gethost();

const digest = args => {
  return hash.update(Array.prototype.join.call(args, ':')).digest('hex');
};

const quote = str => {
  if (str[0] !== '"') {
    return `"${str}"`;
  }
  return str;
};

const unquote = str => {
  if (str[0] === '"' && str[str.length - 1] === '"') {
    return str.substr(1, str.length - 2);
  }
  return str;
};

const createNonce = requestUri => {
  // recommendation for nonce creation from https://tools.ietf.org/html/draft-undery-sip-digest-00#section-4.2.1
  const timestamp = now().toString();
  const args = [timestamp, requestUri || crypto.randomBytes(32).toString('hex'), secretKey];
  return `${timestamp}-${digest(args)}`;
};

const now = () => {
  const highResolutionTimestamp = process.hrtime();
  // cast returned hr timesamp to microseconds, e.g. https://github.com/sindresorhus/convert-hrtime/blob/master/index.js
  return (highResolutionTimestamp[0] * 1e9 + highResolutionTimestamp[1]) / 1e3;
};
