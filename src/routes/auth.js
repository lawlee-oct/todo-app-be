const router = require("express").Router();

const { ROUTERS } = require("../constants/routers");
const authController = require("../controllers/authController");
const middleAuth = require("../controllers/middleAuth");

router.post(ROUTERS.REGISTER, authController.registerUser);
router.post(ROUTERS.LOGIN, authController.loginUser);
router.post(ROUTERS.LOGOUT, middleAuth.verifyToken, authController.logOut);
router.get(ROUTERS.GET_ME, middleAuth.verifyToken, authController.getMe);

module.exports = router;
