import { FC, ReactNode } from 'react';
import styles from '../styles/Back.module.css';

interface BackProps {
    children: ReactNode; // Позволяет передавать дочерние элементы
}

export const Back: FC<BackProps> = ({ children }) => {
    return (
        <div className={styles.BodyDescription}>
            {children}
        </div>
    );
};
