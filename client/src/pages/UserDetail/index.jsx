import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import { fetchUser, deleteUser } from "../../api/users";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/Toast/ToastContainer";
import Modal from "../../components/Modal/Modal";
import UserAvatar from "./components/UserAvatar";
import UserInfoRow from "./components/UserInfoRow";
import UserActionBar from "./components/UserActionBar";
import styles from "./index.module.css";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchUser(id);
        if (response.success) {
          setUser(response.data);
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user. Please try again.');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      const response = await deleteUser(user.id);
      if (response.success) {
        showSuccess(`User "${user.first_name} ${user.last_name}" deleted successfully!`);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      showError(error.message || 'Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.page}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading user details...</p>
          </div>
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <div className={styles.page}>
          <div className={styles.container}>
            <div className={styles.errorState}>
              <div className={styles.errorIcon}>⚠️</div>
              <h2 className={styles.errorTitle}>User Not Found</h2>
              <p className={styles.errorMessage}>
                {error || 'The user you are looking for does not exist.'}
              </p>
              <button
                className={styles.backButton}
                onClick={() => navigate('/')}
              >
                ← Go Back to User List
              </button>
            </div>
          </div>
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.container}>
        <div className={styles.profileCard}>
          <UserAvatar
            gender={user.gender}
            firstName={user.first_name}
            lastName={user.last_name}
          />

          <div className={styles.userName}>
            <h1 className={styles.fullName}>
              {user.first_name} {user.last_name}
            </h1>
            <p className={styles.userSubtitle}>User Profile</p>
          </div>

          <div className={styles.infoSection}>
            <UserInfoRow
              label="ID"
              value={user.id}
              icon="🆔"
              index={0}
            />
            <UserInfoRow
              label="First Name"
              value={user.first_name}
              icon="👤"
              index={1}
            />
            <UserInfoRow
              label="Last Name"
              value={user.last_name}
              icon="👤"
              index={2}
            />
            <UserInfoRow
              label="Email"
              value={user.email}
              icon="✉️"
              index={3}
            />
            <UserInfoRow
              label="Gender"
              value={user.gender}
              icon="⚧️"
              index={4}
            />
            <UserInfoRow
              label="Phone"
              value={user.phone}
              icon="📞"
              index={5}
            />
          </div>

          <UserActionBar
            userId={user.id}
            onDelete={() => setDeleteModalOpen(true)}
          />
        </div>
      </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User"
        size="small"
      >
        <div className={styles.deleteModalContent}>
          <p className={styles.deleteMessage}>
            Are you sure you want to delete{' '}
            <strong>
              {user?.first_name} {user?.last_name}
            </strong>
            ?
          </p>
          <p className={styles.deleteWarning}>
            This action cannot be undone.
          </p>
          <div className={styles.deleteModalButtons}>
            <button
              className={styles.cancelButton}
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className={styles.confirmDeleteButton}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className={styles.spinner}></span>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  );
};

export default UserDetail;
