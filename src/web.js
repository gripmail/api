import { fork } from 'child_process';
import Express from 'express';
import Debug from 'debug';
import config from './lib/config.js'
import path from 'path'

const debug = Debug('web');
const port = process.env.PORT || 3000

console.log(`Binding app on port ${port}`)
const app = Express()

app.get('/', (req,res) => {
  res.send('hello world')
})

app.listen(port)

if (process.env.SEPARATE_PROCESSES != 'true') {
  function onErr(data) { console.error(data.toString('utf8')) }
  function onLog(data) { console.log(data.toString('utf8')) }
  function launch(process) {
    const child = fork(process)
  }

  console.log('SEPARATE_PROCESSES is not set, so spawning other processes as children');
  launch(`src/mail.js`)
}
