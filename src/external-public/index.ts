import * as express from 'express';

module.exports = function (logger) {
    const router = express.Router({
        strict: true
    });
    return { router };
};