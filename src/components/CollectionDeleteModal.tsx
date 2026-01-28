import "../styles/Modal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  collectionName: string;
};

export default function CollectionDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  collectionName,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Delete Collection</h2>
        <p>
          Are you sure you want to delete <strong>{collectionName}</strong>?
          <br />
          This action cannot be undone.
        </p>
        <div className="modal-buttons">
          <button className="modal-cancel" onClick={(e) => { e.stopPropagation(); onClose(); }}>
            Cancel
          </button>
          <button className="modal-delete" onClick={(e) => { e.stopPropagation(); onConfirm(); }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
