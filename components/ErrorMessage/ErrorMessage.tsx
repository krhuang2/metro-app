import styles from './ErrorMessage.module.scss';

export default function ErrorMessage({message}: {message: string}) {
  return <div className={styles.errorMessage} data-testid={'errorMessage'}>{message}</div>;
}