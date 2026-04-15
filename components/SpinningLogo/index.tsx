'use client';

import React from 'react';
import styles from './styles.module.scss';

// "3000 STUDIOS " has 13 chars including space
// The animation uses classes ch1 to ch13 potentially, or more if it loops?
// The user's HTML shows classes ch1 to ch15
// <span class="ch1"> </span>
// <span class="ch2">3</span>
// ...
// Let's replicate the structure exactly.

export default function SpinningLogo() {
  return (
    <div className={styles.container}>
      <span className={`${styles.char} ${styles.ch1}`}> </span>
      <span className={`${styles.char} ${styles.ch2}`}>3</span>
      <span className={`${styles.char} ${styles.ch3}`}>0</span>
      <span className={`${styles.char} ${styles.ch4}`}>0</span>
      <span className={`${styles.char} ${styles.ch5}`}>0</span>
      <span className={`${styles.char} ${styles.ch6}`}> </span>
      <span className={`${styles.char} ${styles.ch7}`}>S</span>
      <span className={`${styles.char} ${styles.ch8}`}>T</span>
      <span className={`${styles.char} ${styles.ch9}`}>U</span>
      <span className={`${styles.char} ${styles.ch10}`}>D</span>
      <span className={`${styles.char} ${styles.ch11}`}>I</span>
      <span className={`${styles.char} ${styles.ch12}`}>O</span>
      <span className={`${styles.char} ${styles.ch13}`}>S</span>
      <span className={`${styles.char} ${styles.ch14}`}></span>
      <span className={`${styles.char} ${styles.ch15}`}></span>
    </div>
  );
}

