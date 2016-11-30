/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  ////'/': {
  ////  view: 'homepage'
  ////},



  "post /getCert": {controller: "ServantController", action: "getCertInfo"},
  "get /weixinLogIn": {controller: "UserController", action: "logIn" },
  "/test": {controller: "ServantController", action: "getCertInfo"},
  "get /getUser" : {controller: "UserController" , action : "getUserInfo"},
  "get /sendNumToPhone" :  {controller: "UserController" , action : "sendNumToPhone"},
  "get /register" : {controller: "UserController" , action : "register"},
  "get /bindingPhone" : {controller: "UserController" , action : "bindingPhone"},
  "get /getUserCard" : {controller: "CardController" , action : "getUserCard"},
  //测试
  "get /weixinLogInTest" : {controller: "UserController" , action : "logInTest"},

  "get /getAllSkill" : {controller: "SkillController" , action : "getAllSkill"},
  "post /updateUserInfo": {controller: "UserInfoController" , action : "updateUserInfo"},

  "get /getTagList" : {controller: "TagController" , action : "getTagList"},
  "post /getServantList": {controller: "TagController" , action : "getServantList"},
  "get /pay": {controller: "PayController" , action : "pay"},
  "get /notice" : {controller: "PayController" , action : "notice"},
  "get /sendMessageToUser" : {controller : "MessageController", action : "sendMessageToUser"},
  "post /uploadFiles": {controller : "UploadFilesController", action : "uploadFiles"}
   /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
