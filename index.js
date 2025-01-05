import express from 'express';
import path from 'path';
import router from './src/router.js';
import fileupload from 'express-fileupload'
import http from 'http'
import { Server } from "socket.io";


const __dirname = path.resolve()

const app = express();
const server = http.Server(app)
const io = new Server(server)

import USERS_CONTROLLER from './src/controllers/users.js';
io.on('connection', async (stream) => {
  USERS_CONTROLLER.validate(stream)
})



app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(fileupload({}))
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font')))
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))
app.use(router)



async function start() {
  try {
    server.listen(process.env.PORT ?? null, () => { console.log(`Serve on :3 ${process.env.HOST}${process.env.PORT ?? null}`) });
  } catch (e) {
    console.log(e)
  }
}
start()




