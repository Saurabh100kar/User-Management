import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import UserForm from '../../components/UserForm/UserForm';
import { fetchUser, updateUser } from '../../api/users';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/Toast/ToastContainer';
import styles from './index.module.css';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetchUser(id);
        if (response.success) {
          setUser(response.data);
        } else {
          showError('User not found');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (error) {
        showError('Failed to load user. Please try again.');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id, navigate, showError]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await updateUser(id, formData);
      if (response.success) {
        showSuccess('User updated successfully!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to update user. Please try again.';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <AdminLayout>
        <div className={styles.page}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p className={styles.loadingText}>Loading user...</p>
          </div>
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <span className={styles.icon}>✏️</span>
              Edit User
            </h1>
          </div>

          <div className={styles.formContainer}>
            <UserForm initialData={user} onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  );
};

export default EditUser;

