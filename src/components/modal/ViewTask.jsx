import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

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

const ViewTask = ({ onClose, isOpen, task }) => {
  return (
    <AnimatePresence>
      {isOpen && task && (
        <Overlay
          initial="initial"
          animate="isOpen"
          exit="exit"
          variants={modalVariant}
          onClick={onClose} // Close modal when clicking outside
        >
          <ModalContainer
            variants={containerVariant}
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
          >
            <CloseButton
              onClick={onClose}
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
              <div className="flex flex-col items-center">
                <div className="mt-4 w-full max-w-sm text-left">
                  <p className="p-2 mb-2 border rounded w-full">
                    <strong>Task:</strong> {task.title}
                  </p>
                  <p className="p-2 mb-2 border rounded w-full">
                    <strong>Description:</strong> {task.description}
                  </p>
                  <p className="p-2 mb-2 border rounded w-full">
                    <strong>Created On:</strong> {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="w-full flex justify-end gap-3 mt-4">
                <button
                  className="p-1 px-4 rounded-xl font-semibold text-black hover:bg-gray-200"
                  onClick={onClose} // Close modal when clicking the button
                >
                  Close
                </button>
              </div>
            </ModalContent>
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default ViewTask;
