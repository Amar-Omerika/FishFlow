import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
  content?: string;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
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
          TransitionComponent={motion.div}
          transition={{ duration: 0.2 }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <div id="alert-dialog-description">{content}</div>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Ne
            </Button>
            <Button onClick={onDelete} color="error" autoFocus>
              Da
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>,
    document.getElementById("modal-root")!
  );
};

export default DeleteModal;
