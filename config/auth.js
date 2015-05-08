// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1576833329233718', // your App ID
        'clientSecret'  : '1ec1e145c288039ffcaf0087628332c0', // your App Secret
        'callbackURL'   : 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'QrIItBHarEQgQvIO7ngD7Tq1N',
        'consumerSecret'    : 'ccMXA6IflviQE5DniFrbE7or1DOyt16C5RltBReHZRRVnBET0C',
        'callbackURL'       : 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '593193782119-jdjin4o08104ihjbf2mv2j7sc60mgg06.apps.googleusercontent.com',
        'clientSecret'  : 'WR-1M01oCsfVQc9Omi9vXcGl',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};