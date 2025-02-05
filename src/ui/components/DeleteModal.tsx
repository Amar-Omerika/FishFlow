import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper, // For styling the modal content
} from "@mui/material";
import { styled } from "@mui/material/styles"; // For custom styling

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string; // Make title prop optional
  content?: string; // Make content prop optional
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3), // Add some padding
  borderRadius: theme.shape.borderRadius, // Rounded corners
}));

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  title = "Obrisi Korisnika",
  content = "Da li ste sigurni da zelite obrisati ovoga korisnika?",
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={onClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperComponent={StyledPaper}
          {...motion.div({
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.8, opacity: 0 },
            transition: { duration: 0.2 },
          })}
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <div id="alert-dialog-description">{content}</div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Da
            </Button>
            <Button onClick={onDelete} color="error" autoFocus>
              Ne
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root")!
  );
};

export default DeleteModal;
