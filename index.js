import express from 'express';
import path from 'path';
import os from 'os';
import { engine } from 'express-handlebars';
import session from 'express-session';
import flash from 'express-flash'
import sequelize from './db/conn.js'
import FileStore from 'session-file-store'
import dotenv from 'dotenv';
dotenv.config();

const fileStore = FileStore(session)

console.log('hii');
console.log(process.env.DB_HOST);
console.log(process.env.DB_INSTANCE);


import Thought from './models/Thought.js'
import User from './models/User.js'

// Import Routes
import thoughtsRoutes from './routes/thoughtsRoutes.js'
import authRoutes from './routes/authRoutes.js'

// Import Controller
import ThoughtController from './controllers/ThoughtController.js'

const app = express()

app.use(express.static('public'))
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.use(express.json())
app.use(express.urlencoded({
    extended: true,
}))
// configurando a sessão
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new fileStore({
            logFn: function() {},
            path: path.join(os.tmpdir(), 'sessions')
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true,
        }
    }),
)
// flash messages
app.use(flash())
// set session to res
app.use((req,res,next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    }
    next();
})

// Routes
app.use('/thoughts', thoughtsRoutes)
app.use('/', authRoutes)

app.get('/', ThoughtController.showThoughts)


const port = process.env.PORT || 8080;
// app.listen(port)
app.listen(port, () => {
    console.log('Hello world listening on port', port);
  });
// sequelize.sync( 
    // {force: true} 
// ).then(() => {  }).catch((err)=> console.log(err));

