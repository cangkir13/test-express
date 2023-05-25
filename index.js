const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");

// Inisialisasi koneksi database
const sequelize = new Sequelize("halo", "dev", "1", {
  host: "localhost",
  dialect: "mysql",
});

// Model Task
const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Sinkronisasi model dengan database
sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

const app = express();
app.use(express.json());

// Endpoint GET /tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint POST /task
app.post("/task", async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.create({ title, description, completed });
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint GET /tasks/{id}
app.get("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error retrieving task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint PATCH /tasks/{id}
app.patch("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, completed } = req.body;
    const task = await Task.findByPk(taskId);
    if (task) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.completed = completed || task.completed;
      await task.save();
      res.json(task);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint DELETE /tasks/{id}
app.delete("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId);
    if (task) {
      await task.destroy();
      res.json({ message: "Task deleted successfully" });
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
