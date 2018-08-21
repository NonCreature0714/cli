'use strict'

const BB = require('bluebird')

const optCheck = require('figgy-pudding')({})
const readUserInfo = require('./read-user-info.js')

module.exports = otplease
function otplease (opts, fn) {
  opts = opts.concat ? opts : optCheck(opts)
  return BB.try(() => {
    return fn(opts)
  }).catch(err => {
    if (err.code !== 'EOTP' && !(err.code === 'E401' && /one-time pass/.test(err.body))) {
      throw err
    } else if (!process.stdin.isTTY || !process.stdout.isTTY) {
      throw err
    } else {
      return readUserInfo.otp().then(otp => fn(opts.concat({otp})))
    }
  })
}
