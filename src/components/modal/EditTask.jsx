import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../../axiosInterceptors";

const EditTask = ({ isOpen, onClose, task, onUpdate }) => {
  const formik = useFormik({
    initialValues: {
      title: task?.title || "",
      description: task?.description || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        await api.put(`/todos/${task._id}`, values);
        onUpdate(); // Notify parent to refresh tasks
        onClose();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <input
              id="title"
              name="title"
              type="text"
              {...formik.getFieldProps("title")}
              className="w-full px-3 py-2 border rounded-md"
            />
            {formik.touched.title && formik.errors.title && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
            )}
          </div>
          <div className="mb-4">
            <textarea
              id="description"
              name="description"
              {...formik.getFieldProps("description")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
