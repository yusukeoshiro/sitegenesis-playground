'use strict';

/**
 * Waits for an import job to finish.
 **/
module.exports = function (grunt) {
    grunt.registerMultiTask('dw_bm_login', 'Login using request module', function () {
        var options = this.options(),
            done = this.async();

        var request = require('../lib/util/bm_request');

        request.post({
            url: options.server + '/on/demandware.store/Sites-Site/default/ViewApplication-ProcessLogin',
            followRedirect: true,
            form: {
                LoginForm_Login: options.username,
                LoginForm_Password: options.password,
                LoginForm_RegistrationDomain: 'Sites'
            },
            jar: true,
            ignoreErrors: true
        }, function () {
            done();
        });
    });
};

