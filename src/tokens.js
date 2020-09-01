module.exports = {
    getAccessToken: async (req) => {
        if (req.user) {
            let storedToken = req.user.oauthToken;
            console.log(`tyyyyppeee =========+> `)
            console.log(typeof(storedToken));
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
        console.log("foo");
        let storedToken = oauthToken;
        if (storedToken) {
            console.log("bar");
            if (storedToken.expired()) {
                console.log("gar");
                let newToken = await storedToken.refresh();
                return newToken.token.access_token;
            }
            console.log("dar");
            return storedToken.token.access_token;
        }
    }

};
