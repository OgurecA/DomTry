import { useRouter } from 'next/router';
import styles from '../styles/RoleChoose.module.css'; // Создайте файл стилей по желанию

const RoleChoose = () => {
  const router = useRouter();

  // Функция для навигации по страницам
  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.panelContainer}>
      <button className={styles.button} onClick={() => navigateTo('/sender')}>Sender</button>
      <button className={styles.button} onClick={() => navigateTo('/courier')}>Courier</button>
      <button className={styles.button} onClick={() => navigateTo('/receiver')}>Receiver</button>
    </div>
  );
};

export default RoleChoose;
