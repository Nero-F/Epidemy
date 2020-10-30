const redis_client = require('./cache/redis_cache').async_client;

const getAccessTokenBot = async (oauthToken) => {
    let storedToken = oauthToken;
    if (storedToken) {
        // Apparently storedToken.expired() doesn't seem to work poperly so I don't use it
        // TODO! compare expires_in argument to mimic storedToken.expired() and refresh it correctly
        let newToken = await storedToken.refresh();
        return newToken.token.access_token;
    }
};

module.exports = {
    // use these in a express routes
    getAccessToken: async (req) => {
        if (req.user) {
            let storedToken = req.user.oauthToken;
            if (storedToken) {
                if (storedToken.expired()) {
                    let newToken = await storedToken.refresh();
                    req.user.oauthToken = newToken;
                    return newToken.token.access_token;
                }
                return storedToken.token.access_token;
            }
        }
    },
    getAccessTokenBot,
    retrieveTokenFromDb: async () => {
        try {
            const keys = await redis_client.keys('*');
            const key = keys.shift();
            const tmp = await redis_client.get(key)
            const {refresh_token, access_token, expires_in}= JSON.parse(tmp).passport.user.oauthToken.token;
            const params = { refresh_token, access_token, expires_in };
            const tokeN = o2G.accessToken.create(params); // Not really Optimal but only solution I could get for the moment
            const res = await getAccessTokenBot(tokeN);

            return res;
        } catch (err) {
            console.error(err);
        }
    }
};
