import styles from './UserAvatar.module.css';

const UserAvatar = ({ gender, firstName, lastName }) => {
  const getAvatarStyle = () => {
    const genderUpper = gender?.toUpperCase();
    if (genderUpper === 'FEMALE') {
      return styles.female;
    } else if (genderUpper === 'MALE') {
      return styles.male;
    }
    return styles.other;
  };

  const getInitials = () => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || '?';
  };

  const getIcon = () => {
    const genderUpper = gender?.toUpperCase();
    if (genderUpper === 'FEMALE') {
      return '♀️';
    } else if (genderUpper === 'MALE') {
      return '♂️';
    }
    return '👤';
  };

  return (
    <div className={`${styles.avatarContainer} ${getAvatarStyle()}`}>
      <div className={styles.avatarCircle}>
        <span className={styles.avatarIcon}>{getIcon()}</span>
      </div>
      <div className={styles.initials}>{getInitials()}</div>
    </div>
  );
};

export default UserAvatar;

