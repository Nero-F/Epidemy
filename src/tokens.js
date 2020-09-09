const mongoose = require('mongoose');
module.exports = {
    getAccessToken: async (req) => {
        if (req.user) {
            let storedToken = req.user.oauthToken;
            if (storedToken) {
                if (storedToken.expired()) {
                    // refresh token
                    let newToken = await storedToken.refresh();
                    // Update stored token
                    req.user.oauthToken = newToken;
                    return newToken.token.access_token;
                }
                // Token still valid, just return it
                return storedToken.token.access_token;
            }
        }
    },
    getAccessTokenBot: async (oauthToken) => {
        let storedToken = oauthToken;
        if (storedToken) {
            if (storedToken.expired()) {
                let newToken = await storedToken.refresh();
                return newToken.token.access_token;
            }
            return storedToken.token.access_token;
        }
    }

};
