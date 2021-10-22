// require('../config/passport');
// const express = require('express');
// const passport = require('passport');
// const router = express.Router();
// const userController = require('../controllers/users');
// const {
//   debugMiddleware,
//   checkIfRequiresUsernameUpdate,
//   checkIfUserEmailExists,
//   checkIfSocialAccount,
// } = require('../middleware/middleware');

// const passportSignIn = passport.authenticate('local', { session: false });
// const passportJWT = passport.authenticate('jwt', { session: false });
// const passportGoogle = passport.authenticate('googleToken', { session: false });

// // login
// router.route('/login').post(passportSignIn, userController.login);

// //signUp
// router.route('/signup').post(userController.signUp);

// // get the user details from the token
// router.route('/current').get(passportJWT, userController.getUser);

// // get User from handle name
// router.route('/handle/:hanle').get(userController.getUserByHandle);

// // get all user
// router.route('/all').get(passportJWT, userController.getAllUserExceptSelf);

// // google token strategy
// router.route('/google/token').get(passportGoogle, userController.googleOAuth);

// // update username
// router
//   .route('/username/update')
//   .patch(
//     passportJWT,
//     checkIfRequiresUsernameUpdate,
//     userController.updateUserName
//   );

// // send change password link mail to user
// router
//   .route('/change/password')
//   .post(
//     checkIfUserEmailExists,
//     checkIfSocialAccount,
//     userController.passwordResetLink
//   );

// //verification of password link
// router
//   .route('/passwordchange/:id')
//   .post(userController.verifyPasswordChangedLink);

// // change and delete profile pic
// router
//   .route('/profile/pic')
//   .post(passportJWT, userController.updateProfilePic)
//   .delete(passportJWT, userController.removeProfilePic);

// router
//   .route('subscribe/push')
//   .post(passportJWT, userController.subscribeToPush);

// module.exports = router;

const express = require('express');
const passport = require('passport');
const router = express.Router();
const UserController = require('../controllers/users');
require('../config/passport');
const {
  signupValidationRules,
  loginValidationRules,
  usernameUpdateValidationRules,
  resetPasswordValidationRules,
} = require('../validators/authValidators');
const validate = require('../validators/validate');
const {
  debugMiddleware,
  checkIfRequiresUsernameUpdate,
  checkIfUserEmailExists,
  checkIfSocialAccount,
} = require('../middleware/middleware');

const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });
const passportGoogle = passport.authenticate('googleToken', { session: false });

// signup route
router
  .route('/signup')
  .post(signupValidationRules(), validate, UserController.signup);

// login route
router
  .route('/login')
  .post(loginValidationRules(), validate, passportSignIn, UserController.login);

// get the users details from the token
router.route('/current').get(passportJWT, UserController.getUser);

// get user from handle name
router.route('/handle/:handle').get(UserController.getUserByHandle);

// get all the users in the database
router.route('/all').get(passportJWT, UserController.getAllUsersExceptSelf);

// Google token strategy
router.route('/google/token').get(passportGoogle, UserController.googleOAuth);

// update username
router
  .route('/username/update')
  .patch(
    passportJWT,
    checkIfRequiresUsernameUpdate,
    usernameUpdateValidationRules(),
    validate,
    UserController.updateUserName
  );

// THIS SENDS CHANGE PASSWORD LINK MAIL TO USER
router
  .route('/change/password')
  .post(
    checkIfUserEmailExists,
    checkIfSocialAccount,
    UserController.sendPasswordResetLink
  );

// VERIFICATION OF PASSWORD LINK
router.route('/pw_chng/:id').post(UserController.verifyPasswordChangeLink);

// CHANGE PASSWORD IN DB
router
  .route('/chng_pwd')
  .post(
    passportJWT,
    resetPasswordValidationRules(),
    validate,
    UserController.changePassword
  );

router
  .route('/profile/pic')
  .post(passportJWT, UserController.updateProfilePic)
  .delete(passportJWT, UserController.removeProfilePic);

router
  .route('/subscribe/push')
  .post(passportJWT, UserController.subscribeToPush);

module.exports = router;
