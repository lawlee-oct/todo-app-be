const { TodoModel } = require("../models/TodoModel");

const todoController = {
  getAllTodo: async (req, res) => {
    try {
      const todos = await TodoModel.find();

      res.status(200).json({
        code: 200,
        message: "Getting all Todos successfully.",
        data: todos,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // CREATE TODO
  createTodo: async (req, res) => {
    try {
      const checkTodoName = await TodoModel.findOne({
        title: req.body?.title?.trim(),
      });

      if (checkTodoName) {
        return res.status(404).json({ message: "Todo already exists!" });
      }

      const newTodo = await new TodoModel({
        ...req.body,
      });

      const todo = await newTodo.save();

      res.status(200).json({
        message: "Created Todo success!",
        data: todo,
        code: 200,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error create todo", error: error.message });
    }
  },

  // UPDATE TODO
  updateTodo: async (req, res) => {
    try {
      const { id } = req.params;

      const todo = await TodoModel.findById(id);

      if (!todo) {
        return res.status(404).json({ message: "Todo already exists!" });
      }

      const checkTodoName = await TodoModel.findOne({
        title: req.body?.title?.trim(),
        _id: { $ne: id }, // Loại trừ todo hiện tại
      });

      if (checkTodoName) {
        return res.status(404).json({ message: "Title Todo already exists!" });
      }

      // Cập nhật todo
      const updatedTodo = await TodoModel.findByIdAndUpdate(
        id,
        {
          ...req.body,
        },
        { new: true } // Trả về todo đã được cập nhật
      );

      res.status(200).json({
        message: "Update success!",
        data: updatedTodo,
        code: 200,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error update todo", error: error.message });
    }
  },

  deleteTodo: async (req, res) => {
    try {
      const { id } = req.params;

      const deletedTodo = await TodoModel.findByIdAndDelete(id);

      if (!deletedTodo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res
        .status(200)
        .json({ message: "Todo deleted successfully", todo: deletedTodo });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting todo", error: error.message });
    }
  },
};

module.exports = todoController;
