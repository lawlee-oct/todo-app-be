const router = require("express").Router();

const { ROUTERS } = require("../constants/routers");
const middleAuth = require("../controllers/middleAuth");
const todoController = require("../controllers/todoController");

router.get(
  ROUTERS.GET_ALL_TODO,
  middleAuth.verifyToken,
  todoController.getAllTodo
);
router.post(
  ROUTERS.CREATE_TODO,
  middleAuth.verifyToken,
  todoController.createTodo
);
router.patch(
  ROUTERS.UPDATE_TODO,
  middleAuth.verifyToken,
  todoController.updateTodo
);
router.delete(
  ROUTERS.DELETE_TODO,
  middleAuth.verifyToken,
  todoController.deleteTodo
);
router.delete(
  ROUTERS.FINISH_TODO,
  middleAuth.verifyToken,
  todoController.deleteTodo
);

module.exports = router;
