import { Router } from "express";
import { userController } from "../controllers/user-controller";

const router = Router();

router.get("/users", userController.getUsers.bind(userController));
router.get("/verify/:token", userController.validateUser.bind(userController));
router.get("/user", userController.getUser.bind(userController));
router.patch("/user", userController.updateUser.bind(userController));
router.post("/signup", userController.signup.bind(userController));
router.post("/signin", userController.signin.bind(userController));
router.post("/logout", userController.logoutUser.bind(userController));
router.post("/recover", userController.recoverUser.bind(userController));
router.post("/recover/:token", userController.updateUserPassword.bind(userController));
router.delete("/user", userController.deleteUser.bind(userController));

export default router;
