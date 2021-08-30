import Imap from 'imap'
import Debug from 'debug'
import config from './lib/config.js'
import simplePromise from './lib/simplePromise.js'

const debug = Debug('mail');

class Mail {
  constructor() {
    this.imap = new Imap({
      user: process.env.IMAP_USER,
      password: process.env.IMAP_PASSWORD,
      host: process.env.IMAP_SERVER,
      port: process.env.IMAP_PORT,
      tls: process.env.IMAP_TLS !== 'false',
    });
    debug('Opening new IMAP connection', process.env.IMAP_USER, process.env.IMAP_SERVER)

    this.imap.once('ready', this.onReady);
    this.imap.connect();
  }

  onReady() {
    console.log('IMAP connection ready')
  }

  async openBox(box) {
    return simplePromise(this.imap.openBox.bind(imap, box));
  }

  async search(query) {
    return simplePromise(this.imap.search.bind(imap, ['ALL', ['BODY', query]]));
  }
}

new Mail()
