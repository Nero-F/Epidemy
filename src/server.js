require('dotenv').config();
const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
require('redis');
const RedisStore = require('connect-redis')(session);

// routers
const authRouter = require('./routes/auth');
const calendarRouter = require('./routes/calendar');

const graph = require('./graph');
const app = express();

const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

let users = {};

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(async (user, done) => {
    done(null, user);
});

const PORT = process.env.SERV_PORT;
const OAUTH_REDIRECT_URI = `http://localhost:${PORT}/auth/callback`;

const configuration = {
    client: {
        id: process.env.APP_ID,
        secret: process.env.APP_SECRET
    },
    auth: {
        tokenHost: process.env.OAUTH_AUTHORITY,
        authorizePath: process.env.OAUTH_AUTHORIZE_ENDPOINT,
        tokenPath: process.env.OAUTH_TOKEN_ENDPOINT
    }
};

const oauth2 = require('simple-oauth2').create(configuration);

global.o2G = oauth2;

const signInComplete = async (iss, sub, profile, accessToken, refreshToken, params, done) => {
    if (!profile.oid)
        return done(new Error("No OID found in user profile."));
    try{
        const user = await graph.getUserDetails(accessToken);
        if (user)
            profile['email'] = user.mail ? user.mail : user.userPrincipalName;
    } catch (err) {
        return done(err);
    }
    let oauthToken = oauth2.accessToken.create(params);
    global.token = oauthToken;

    users[profile.oid] = { profile, oauthToken };
    return done(null, users[profile.oid]);
}

passport.use(new OIDCStrategy(
    {
        identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
        clientID: process.env.APP_ID,
        responseType: 'code id_token',
        responseMode: 'form_post',
        redirectUrl: OAUTH_REDIRECT_URI,
        allowHttpForRedirectUrl: true,
        clientSecret: process.env.APP_SECRET,
        validateIssuer: false,
        passReqToCallback: false,
        scope: process.env.GRAPH_SCOPES.split(' ')
      },
      signInComplete
));

const redis_client = require('./redis_cache').client;

app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new RedisStore({
        client: redis_client,
        prefix: 'sesh'
    }),
    resave: true,
    saveUninitialized: false,
    unset: 'destroy',
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.error = req.flash('error_msg');

    let errs = req.flash('error');
    for (var i in errs){
        res.locals.error.push({message: 'An error occurred', debug: errs[i]});
    }
    next();
});

// View Engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

const hbs = require('hbs');
const moment = require('moment');

// Helper to format date/time sent by Graph
hbs.registerHelper('eventDateTime', (dateTime) => {
    return moment(dateTime).format('M/D/YY h:mm A');
});

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('rsrcs'))
app.use(express.static('rsrcs/fonts'))

app.use((req, res, next) => {
    if (req.user) {
        res.locals.user = req.user.profile;
    }
    next();
});

app.get('/', (req, res, next) => {
    let params = { active: { home: true } };
    res.render('index', params);
});

app.use('/auth', authRouter);
app.use('/calendar', calendarRouter);

// catch 404 and forward to error handler
app.use((req, res, next) =>  next(createError(404)));

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const discord_client = require('./discord-bot/bot');

app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT} !!`));
