// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/signin', (req, res, next) => {
    passport.authenticate('azuread-openidconnect',
    {
        response: res,
        prompt: 'login',
        failureRedirect: '/',
        failureFlash: true,
        successRedirect: '/'
    })(req,res,next);
});

// <CallbackRouteSnippet>
router.post('/callback', (req, res, next) => {
    passport.authenticate('azuread-openidconnect',
    {
        response: res,
        failureRedirect: '/',
        failureFlash: true,
        successRedirect: '/'
    })(req,res,next);
    console.log('-------------------------------------------');
    console.log(res.statusCode);
    console.log('-------------------------------------------');
});
// </CallbackRouteSnippet>

router.get('/signout', (req, res) => {
    req.session.destroy((err) => {
        req.logout();
        res.redirect('/');
    });
});

module.exports = router;
