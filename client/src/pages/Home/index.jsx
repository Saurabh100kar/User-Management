import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import styles from "./index.module.css";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import GenderFilter from "./components/GenderFilter";
import UserTable from "./components/UserTable";
import Pagination from "./components/Pagination";
import Modal from "../../components/Modal/Modal";
import ToastContainer from "../../components/Toast/ToastContainer";
import { fetchUsers, deleteUser } from "../../api/users";
import { useToast } from "../../hooks/useToast";

const Home = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [order, setOrder] = useState('asc');
  const [genderFilter, setGenderFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchUsers({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sortBy,
        order: order,
        gender: genderFilter || null,
        search: searchTerm || null,
      });
      
      if (response.success) {
        const fetchedUsers = response.data.users || [];
        setUsers(fetchedUsers);
        setPagination((prevState) => ({
          ...prevState,
          total: response.data.total || 0,
        }));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      showError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.limit, sortBy, order, genderFilter, searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Reset to page 1 when searching
    setPagination((prevState) => ({ ...prevState, page: 1 }));
  };

  const handleSort = (field, newOrder) => {
    setSortBy(field);
    setOrder(newOrder);
    // Reset to page 1 when sorting
    setPagination((prevState) => ({ ...prevState, page: 1 }));
  };

  const handleGenderFilter = (gender) => {
    setGenderFilter(gender);
    // Reset to page 1 when filtering
    setPagination((prevState) => ({ ...prevState, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prevState) => ({ ...prevState, page: newPage }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (userId) => {
    const user = users.find((u) => u.id === userId);
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const response = await deleteUser(userToDelete.id);
      if (response.success) {
        showSuccess(`User "${userToDelete.first_name} ${userToDelete.last_name}" deleted successfully!`);
        setDeleteModalOpen(false);
        setUserToDelete(null);
        // Reload users
        await loadUsers();
      }
    } catch (error) {
      showError(error.message || 'Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <AdminLayout>
      <div className={styles.home}>
        <div className={styles.container}>
          <Header totalUsers={pagination.total} onCreateClick={() => navigate('/create')} />
          <SearchBar onSearch={handleSearch} value={searchTerm} />
          <GenderFilter selectedGender={genderFilter} onGenderChange={handleGenderFilter} />
          
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p className={styles.loadingText}>Loading users...</p>
            </div>
          ) : (
            <>
              <UserTable 
                users={users} 
                searchTerm={searchTerm} 
                onDelete={handleDeleteClick}
                sortBy={sortBy}
                order={order}
                onSort={handleSort}
              />
              <Pagination
                currentPage={pagination.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>

      <Modal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Delete User"
        size="small"
      >
        <div className={styles.deleteModalContent}>
          <p className={styles.deleteMessage}>
            Are you sure you want to delete{' '}
            <strong>
              {userToDelete?.first_name} {userToDelete?.last_name}
            </strong>
            ?
          </p>
          <p className={styles.deleteWarning}>
            This action cannot be undone.
          </p>
          <div className={styles.deleteModalButtons}>
            <button
              className={styles.cancelButton}
              onClick={handleDeleteCancel}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className={styles.confirmDeleteButton}
              onClick={handleDeleteConfirm}
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

export default Home;
