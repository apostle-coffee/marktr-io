import { useState, useEffect } from "react";
import "../styles/Modal.css";

type Props = {
  isOpen: boolean;
  initialName: string;
  onClose: () => void;
  onConfirm: (name: string) => void;
};

export default function CollectionRenameModal({ isOpen, initialName, onClose, onConfirm }: Props) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  if (!isOpen) return null;

  const handleSave = () => {
    onConfirm(name.trim());
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-3">Rename Collection</h2>
        <input
          onClick={(e) => e.stopPropagation()}
          className="w-full border border-black rounded-design px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="modal-cancel"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="modal-delete"
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
