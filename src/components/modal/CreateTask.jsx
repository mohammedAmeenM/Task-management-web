import { useFormik } from 'formik';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { createTaskValidationSchema } from '../validation/validationSchma';
import api from '../../axiosInterceptors';

// Styled components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
`;

const ModalContainer = styled(motion.div)`
  width: 90%;
  max-width: 600px;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 12px;
  overflow: hidden;
  @media (min-width: 640px) {
    width: 80%;
  }
  @media (min-width: 768px) {
    width: 70%;
  }
`;

const CloseButton = styled.svg`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 18px;
  top: 18px;
  cursor: pointer;
`;

const ModalContent = styled.div`
  padding: 20px;
  h1 {
    color: #5c3aff;
  }
`;

const modalVariant = {
  initial: { opacity: 0 },
  isOpen: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariant = {
  initial: { top: "-50%", transition: { type: "spring" } },
  isOpen: { top: "50%" },
  exit: { top: "-50%" },
};

const CreateTask = ({ onClose, isOpen,onCreate }) => {
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: createTaskValidationSchema,
    onSubmit:  async(values, { resetForm })=> {
      try {
        // Make the API request
        const response = await api.post('/todos', values);
        
        if (response.status === 201) {
          console.log('Todo created successfully:', response.data);
          resetForm();
          onCreate()
          onClose(false);
        }
      } catch (error) {
        console.error('Error creating todo:', error);
      }
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial="initial"
          animate="isOpen"
          exit="exit"
          variants={modalVariant}
        >
          <ModalContainer variants={containerVariant}>
            <CloseButton
              onClick={() => onClose(false)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20.39 20.39"
            >
              <title>close</title>
              <line
                x1="19.39"
                y1="19.39"
                x2="1"
                y2="1"
                fill="none"
                stroke="#5c3aff"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
              />
              <line
                x1="1"
                y1="19.39"
                x2="19.39"
                y2="1"
                fill="none"
                stroke="#5c3aff"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="2"
              />
            </CloseButton>
            <ModalContent className="flex flex-col">
              <form onSubmit={formik.handleSubmit} className="flex flex-col">
                {/* Title */}
                <div className="mb-2">
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    className="p-2 mb-2 border rounded w-full"
                    {...formik.getFieldProps('title')}
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
                  ) : null}
                </div>

                {/* Description */}
                <div className="mb-2">
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    className="p-2 mb-2 border rounded w-full"
                    {...formik.getFieldProps('description')}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
                  ) : null}
                </div>

                <div className="w-full flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    className="p-1 px-4 rounded-xl font-semibold text-black hover:bg-gray-200"
                    onClick={() => onClose(false)}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className='border p-1 px-4 rounded-xl bg-blue-400 font-semibold text-white hover:bg-blue-800'
                  >
                    Save
                  </button>
                </div>
              </form>
            </ModalContent>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default CreateTask;
