const express = require('express');
const router = express.Router();
const tokens = require('../tokens.js');
const graph = require('../graph.js');
const util = require('util');

router.get('/', async (req, res) => {
    if (!req.isAuthenticated())
        res.redirect('/') // Redirect unauthenticated requests to home page
    else {
        let params = { active: { calendar: true } };

      // Get the access token
        var accessToken;
        try {
            accessToken = await tokens.getAccessToken(req);
        } catch (err) {
            req.flash('error_msg', {
                message: 'Could not get access token. Try signing out and signing in again.',
                debug: JSON.stringify(err)
            });
        }
        if (accessToken && accessToken.length > 0) {
            try {
          // Get the events
                var events = await graph.getEvents(accessToken);
                var lol = await graph.getWeekAERAvailiabityByName(accessToken, 'F');
                params.events = events.value;
            } catch (err) {
                req.flash('error_msg', {
                    message: 'Could not fetch events',
                    debug: JSON.stringify(err)
                });
            }
      } else
          req.flash('error_msg', 'Could not get an access token');
      res.render('calendar', params);
    }
});

/*
router.get('/week-avail/:id', async (req, res) => {
    if (!req.isAuthenticated())
        res.redirect('/') // Redirect unauthenticated requests to home page
    else {
        let params = { active: { calendar: true } };

      // Get the access token
        var accessToken;
        try {
        accessToken = await tokens.getAccessToken(req);
        } catch (err) {
            req.flash('error_msg', {
                message: 'Could not get access token. Try signing out and signing in again.',
                debug: JSON.stringify(err)
            });
        }
        if (accessToken && accessToken.length > 0) {
            try {
          // Get the events
                let avail = await graph.getWeekAERAvailiabityByName(accessToken, req.params.id);
                console.log(foo);
                params.events = events.value;
            } catch (err) {
                req.flash('error_msg', {
                    message: 'Could not fetch events',
                    debug: JSON.stringify(err)
                });
            }
      } else
          req.flash('error_msg', 'Could not get an access token');
      res.json(avail);
    }
});
// </GetRouteSnippet>
*/
module.exports = router;
