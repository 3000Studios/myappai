/*
 *   Copyright (c) 2025 NAME.
 *   All rights reserved.
 *   Unauthorized copying, modification, distribution, or use of this is prohibited without express written permission.
 */

import axios from 'axios';

const WP_URL = 'https://3000studios.com/wp-json/jwt-auth/v1/token';
const WP_UPDATE = 'https://3000studios.com/wp-json/wp/v2/files/update';

const USERNAME = process.env.WP_USERNAME || 'mr.jwswain@gmail.com';
const PASSWORD = process.env.WP_PASSWORD || '';

let cachedToken: string | null = null;

export async function getWPToken() {
  if (cachedToken) return cachedToken;

  const res = await axios.post(WP_URL, {
    username: USERNAME,
    password: PASSWORD,
  });

  cachedToken = res.data.token;
  return cachedToken;
}

export async function runWordPressUpdate(file: string, content: string) {
  const token = await getWPToken();

  const res = await axios.post(
    WP_UPDATE,
    { file, content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}

