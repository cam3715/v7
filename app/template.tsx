import styles from "./page-transition.module.css";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.transitionRoot}>
      <div className={styles.skeletonLayer} aria-hidden="true">
        <div className={styles.skeletonShell}>
          <div className={styles.skeletonEyebrow} />
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonLine} />
          <div className={styles.skeletonLineShort} />

          <div className={styles.skeletonGrid}>
            <div className={styles.skeletonCard}>
              <div className={styles.skeletonCardTop} />
              <div className={styles.skeletonCardBody} />
              <div className={styles.skeletonCardLine} />
            </div>
            <div className={styles.skeletonCard}>
              <div className={styles.skeletonCardTop} />
              <div className={styles.skeletonCardBody} />
              <div className={styles.skeletonCardLine} />
            </div>
            <div className={styles.skeletonCard}>
              <div className={styles.skeletonCardTop} />
              <div className={styles.skeletonCardBody} />
              <div className={styles.skeletonCardLine} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.pageContent}>{children}</div>
    </div>
  );
}
