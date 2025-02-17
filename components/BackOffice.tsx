import { FC, ReactNode } from 'react';
import styles from '../styles/BackOffice.module.css';

interface BackOfficeProps {
    children: ReactNode; // Позволяет передавать дочерние элементы
}

export const BackOffice: FC<BackOfficeProps> = ({ children }) => {
    return (
        <div className={styles.BodyDescription}>
            {children}
        </div>
    );
};
