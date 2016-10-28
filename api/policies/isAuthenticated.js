/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: 判断是否登陆
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
//module.exports = function(req, res, next) {
//  console.log('req.wantsJSON',req.wantsJSON);
//  // If `req.session.me` exists, that means the user is logged in.
//  if (req.session.openid) return next();
//
//  // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
//  // send a 401 response letting the user agent know they need to login to
//  // access this endpoint.
//  if (req.wantsJSON) {
//    return res.send(401);
//  }
//
//  // Otherwise if this is an HTML-wanting browser, do a redirect.
//  return res.redirect('/login');
//};
