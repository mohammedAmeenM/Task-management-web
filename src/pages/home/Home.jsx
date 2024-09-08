import { useState, useEffect } from "react";
import ViewTask from "../../components/modal/ViewTask";
import CreateTask from "../../components/modal/CreateTask";
import EditTask from "../../components/modal/EditTask";
import api from "../../axiosInterceptors";

const Home = () => {
    

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [tasks, setTasks] = useState({ todo: [], inprogress: [], done: [] });

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/todos?sortBy=${sortBy}`);
      const todos = response.data.todos;
      const groupedTasks = {
        todo: todos.filter((task) => task.status === "todo"),
        inprogress: todos.filter((task) => task.status === "inprogress"),
        done: todos.filter((task) => task.status === "done"),
      };

      const filteredTasks = {
        todo: groupedTasks.todo.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        inprogress: groupedTasks.inprogress.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        done: groupedTasks.done.filter((task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      };

      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    fetchTasks();
  }, [isOpen, isEditModalOpen, searchQuery, sortBy]);

  const handleDragStart = (e, task, status) => {
    e.dataTransfer.setData("task", JSON.stringify({ task, status }));
    e.target.classList.add("dragging-brightness");
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging-brightness");
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const { task, status } = JSON.parse(e.dataTransfer.getData("task"));

    if (status !== newStatus) {
      try {
        await api.patch(`/todos/${task._id}/status`, { status: newStatus });
        fetchTasks();
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
  };

  const handleViewClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteClick = async (taskId) => {
    try {
      await api.delete(`/todos/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Add Task Button */}
      <div className="mb-5 flex justify-start">
        <button
          onClick={handleOpen}
          className="bg-blue-500 px-8 py-1 rounded-lg text-white text-sm"
        >
          Add Task
        </button>
      </div>

      {/* Search and Sort */}
      <div className="w-full border shadow-md p-2 mb-5 rounded-md flex flex-col sm:flex-row justify-between items-center">
        {/* Search Box */}
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <label htmlFor="search" className="text-gray-700 font-medium">
            Search:
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full max-w-xs px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sortBy" className="text-gray-700 font-medium">
            Sort By:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortChange}
            className="ml-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap -mx-2 overflow-x-auto">
        {/* To Do Column */}
        <div
          className="w-full lg:w-1/3 px-2 mb-4 lg:mb-0"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, "todo")}
        >
          <div className="p-4 rounded-lg shadow-md border">
            <h2 className="text-xl font-bold bg-blue-400 text-white mb-4 p-2 rounded-md">
              To Do
            </h2>
            <div className="space-y-4">
              {tasks.todo.map((task) => (
                <div
                  key={task._id}
                  className="bg-blue-100 p-4 rounded-lg shadow-sm relative"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, "todo")}
                  onDragEnd={handleDragEnd}
                >
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-gray-700 mt-2 pb-5">
                    {task.description}
                  </p>
                  <p className="text-sm pb-3 text-gray-500 mt-1">
                    Created on: {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                  <div className="absolute bottom-1 right-2 flex space-x-2">
                    <button
                      onClick={() => handleViewClick(task)}
                      className="text-white text-xs px-2 rounded-md bg-blue-400 hover:text-blue-700 font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditClick(task)}
                      className="text-white text-xs px-2 rounded-md bg-blue-400 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task._id)}
                      className="text-white text-xs bg-red-500 px-2 rounded-md hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* In Progress Column */}
        <div
          className="w-full lg:w-1/3 px-2 mb-4 lg:mb-0"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, "inprogress")}
        >
          <div className="p-4 rounded-lg shadow-md border">
            <h2 className="text-xl font-bold bg-blue-400 text-white mb-4 p-2 rounded-md">
              In Progress
            </h2>
            <div className="space-y-4">
              {tasks.inprogress.map((task) => (
                <div
                  key={task._id}
                  className="bg-blue-100 p-4 rounded-lg shadow-sm relative"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, "inprogress")}
                  onDragEnd={handleDragEnd}
                >
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-gray-700 mt-2 pb-5">
                    {task.description}
                  </p>
                  <p className="text-sm pb-3 text-gray-500 mt-1">
                    Created on: {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                  <div className="absolute bottom-1 right-2 flex space-x-2">
                    <button
                      onClick={() => handleViewClick(task)}
                      className="text-white text-xs px-2 rounded-md bg-blue-400 hover:text-blue-700 font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditClick(task)}
                      className="text-white text-xs px-2 rounded-md bg-blue-400 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task._id)}
                      className="text-white text-xs bg-red-500 px-2 rounded-md hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Done Column */}
        <div
          className="w-full lg:w-1/3 px-2"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, "done")}
        >
          <div className="p-4 rounded-lg shadow-md border">
            <h2 className="text-xl font-bold bg-blue-400 text-white mb-4 p-2 rounded-md">
              Done
            </h2>
            <div className="space-y-4">
              {tasks.done.map((task) => (
                <div
                  key={task._id}
                  className="bg-blue-100 p-4 rounded-lg shadow-sm relative"
                  draggable
                  onDragStart={(e) => handleDragStart(e, task, "done")}
                  onDragEnd={handleDragEnd}
                >
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p className="text-gray-700 mt-2 pb-5">
                    {task.description}
                  </p>
                  <p className="text-sm pb-3 text-gray-500 mt-1">
                    Created on: {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                  <div className="absolute bottom-1 right-2 flex space-x-2">
                    <button
                      onClick={() => handleViewClick(task)}
                      className="text-white text-xs px-2 rounded-md bg-blue-400 hover:text-blue-700 font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditClick(task)}
                      className="text-white text-xs px-2 rounded-md bg-blue-400 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task._id)}
                      className="text-white text-xs bg-red-500 px-2 rounded-md hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedTask && (
        <>
          <ViewTask
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            task={selectedTask}
          />
          <EditTask
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            task={selectedTask}
            onUpdate={() => fetchTasks()}
          />
        </>
      )}

      <CreateTask isOpen={isOpen} onClose={handleClose} onCreate={() => fetchTasks()} />
    </div>
  );
};

export default Home;
