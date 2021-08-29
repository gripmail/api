const dotenv = require('dotenv');
const Imap = require('imap');
const debug = require('debug')('index');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const imap = new Imap({
  user: process.env.IMAP_USER,
  password: process.env.IMAP_PASSWORD,
  host: process.env.IMAP_SERVER,
  port: process.env.IMAP_PORT,
  tls: process.env.IMAP_TLS !== 'false',
});

async function simplePromise(fn) {
  return new Promise((resolve, reject) => {
    fn((err, resp) => {
      if (err) {
        reject(err);
      } else {
        resolve(resp);
      }
    });
  });
}

async function openBox(box) {
  return simplePromise(imap.openBox.bind(imap, box));
}

/* async function listBoxes() {
  return simplePromise(imap.getBoxes.bind(imap));
} */

async function doSearch(query) {
  return simplePromise(imap.search.bind(imap, ['ALL', ['BODY', query]]));
}

async function onReady() {
  debug('imap connected');

  await openBox('Archive');
  const uids = await doSearch('refinance');

  const locator = imap.fetch(uids, { bodies: 'TEXT' });
  let body = '';
  locator.on('message', (msg) => {
    msg.on('body', (stream) => {
      stream.on('data', (chunk) => {
        body += chunk;
      });
    });

    msg.on('end', () => {
      debug('done', body);
    });
  });
}

imap.once('ready', onReady);
imap.connect();
