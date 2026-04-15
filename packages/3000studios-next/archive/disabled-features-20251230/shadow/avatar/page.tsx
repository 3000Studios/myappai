
// Copyright (c) 2025 NAME.
// All rights reserved.
// Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
import styles from "./avatar.module.css";

export const dynamic = "force-dynamic";

import AvatarClientWrapper from "./AvatarClientWrapper";

export default function AvatarPage() {
  return (
    <div className={styles["shadow-avatar-page"]}>
      <h1 className={styles["shadow-avatar-title"]}>Shadow Avatar</h1>
      <div className={styles["shadow-avatar-content"]}>
        <AvatarClientWrapper />
      </div>
    </div>
  );
}

