'use client';

import React from 'react';
import styles from './styles.module.css';

export default function AuroraHero() {
  return (
    <div className={styles.content}>
      <h1 className={styles.title}>
        3000 Studios
        <div className={styles.aurora}>
          <div className={styles.auroraItem}></div>
          <div className={styles.auroraItem}></div>
          <div className={styles.auroraItem}></div>
          <div className={styles.auroraItem}></div>
        </div>
      </h1>
      <p className={styles.subtitle}>In development stages</p>
    </div>
  );
}

