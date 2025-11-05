import { motion } from "framer-motion";

const DraggableCamera = ({ children }) => (
  <motion.div
    drag
    dragMomentum={false}
    dragElastic={0.1}
    className="fixed top-4 right-4 z-50 cursor-grab active:cursor-grabbing"
  >
    {children}
  </motion.div>
);
export default DraggableCamera;