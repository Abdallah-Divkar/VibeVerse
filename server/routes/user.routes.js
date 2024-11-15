/*const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controller.js');
const authCtrl = require('../controllers/auth.controller.js');

router.route('/api/users')
    .get(userCtrl.list)
    .post(userCtrl.create);

router.route('/api/users/:userId')
    .get(authCtrl.requireSignin, userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);


router.route('/api/users/:userId').get(userCtrl.read);
router.route('/api/users/:userId').put(userCtrl.update);
router.route('/api/users/:userId').delete(userCtrl.remove);


router.put('/api/users/follow/:userId', authCtrl.requireSignin, userCtrl.follow);
router.put('/api/users/unfollow/:userId', authCtrl.requireSignin, userCtrl.unfollow);


router.param('userId', userCtrl.userByID);

module.exports = router;*/

