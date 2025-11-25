import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import UserForm from '../../components/UserForm/UserForm';
import { createUser } from '../../api/users';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../../components/Toast/ToastContainer';
import styles from './index.module.css';

const CreateUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await createUser(formData);
      if (response.success) {
        showSuccess('User created successfully!');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to create user. Please try again.';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <span className={styles.icon}>➕</span>
              Create New User
            </h1>
          </div>

          <div className={styles.formContainer}>
            <UserForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </AdminLayout>
  );
};

export default CreateUser;

