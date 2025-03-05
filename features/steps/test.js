const { When } = require('@cucumber/cucumber');

When(/^Send (.*) request to (.*)$/, function (message, url, done) {
    console.log(message, url);
    done();
});