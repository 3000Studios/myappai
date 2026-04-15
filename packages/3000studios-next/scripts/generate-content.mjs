import fs from 'fs';
import path from 'path';

const post = `---
title: "Automated Growth Strategy"
date: "${new Date().toISOString()}"
---

This article was automatically generated to improve SEO,
traffic, and conversion for 3000 Studios.
`;

const blogDir = 'app/blog';
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

fs.writeFileSync(path.join(blogDir, `post-${Date.now()}.md`), post);
console.log('Generated new blog post.');
