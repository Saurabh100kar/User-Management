import { useNavigate } from 'react-router-dom';
import styles from './UserTable.module.css';

const UserTable = ({ users, searchTerm = '', onDelete, sortBy = null, order = 'asc', onSort }) => {
  const navigate = useNavigate();

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className={styles.highlight}>{part}</mark>
      ) : (
        part
      )
    );
  };

  const getGenderIcon = (gender) => {
    return gender?.toUpperCase() === 'MALE' ? '♂️' : '♀️';
  };

  const handleRowClick = (id, e) => {
    // Don't navigate if clicking on action buttons
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/user/${id}`);
  };

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/user/${id}/edit`);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleSort = (field, e) => {
    e.stopPropagation();
    if (onSort) {
      // Toggle order if clicking the same field, otherwise set to asc
      const newOrder = sortBy === field && order === 'asc' ? 'desc' : 'asc';
      onSort(field, newOrder);
    }
  };

  const SortableHeader = ({ field, children, className = '' }) => {
    const isActive = sortBy === field;
    const sortIcon = isActive 
      ? (order === 'asc' ? '↑' : '↓')
      : '⇅';
    
    return (
      <th 
        className={`${className} ${styles.sortableHeader} ${isActive ? styles.activeSort : ''}`}
        onClick={(e) => handleSort(field, e)}
      >
        <div className={styles.headerContent}>
          {children}
          <span className={styles.sortIcon}>{sortIcon}</span>
        </div>
      </th>
    );
  };

  if (users.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📭</div>
        <p className={styles.emptyText}>No users found</p>
        {(searchTerm || sortBy) && (
          <p className={styles.emptySubtext}>
            {searchTerm 
              ? 'Try adjusting your search terms or filters' 
              : 'Try adjusting your filters'}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.idColumn}>ID</th>
              <SortableHeader field="first_name">
                First Name
              </SortableHeader>
              <SortableHeader field="last_name">
                Last Name
              </SortableHeader>
              <SortableHeader field="email" className={styles.emailColumn}>
                <span className={styles.columnIcon}>✉️</span> Email
              </SortableHeader>
              <SortableHeader field="gender" className={styles.genderColumn}>
                <span className={styles.columnIcon}>⚧️</span> Gender
              </SortableHeader>
              <th className={styles.phoneColumn}>
                <span className={styles.columnIcon}>📞</span> Phone
              </th>
              <th className={styles.actionsColumn}>Actions</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {users.map((user, index) => {
              const { id, first_name, last_name, email, gender, phone } = user;
              return (
                <tr
                  key={id}
                  onClick={(e) => handleRowClick(id, e)}
                  className={styles.tableRow}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <td className={styles.idCell}>{id}</td>
                  <td>{highlightText(first_name || '', searchTerm)}</td>
                  <td>{highlightText(last_name || '', searchTerm)}</td>
                  <td className={styles.emailCell}>
                    {highlightText(email || '', searchTerm)}
                  </td>
                  <td className={styles.genderCell}>
                    <span className={styles.genderIcon}>
                      {getGenderIcon(gender)}
                    </span>
                    <span>{gender || 'N/A'}</span>
                  </td>
                  <td className={styles.phoneCell}>
                    {highlightText(phone || '', searchTerm)}
                  </td>
                  <td className={styles.actionsCell}>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editButton}
                        onClick={(e) => handleEdit(id, e)}
                        aria-label="Edit user"
                        title="Edit user"
                      >
                        ✏️
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDelete(id, e)}
                        aria-label="Delete user"
                        title="Delete user"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;

