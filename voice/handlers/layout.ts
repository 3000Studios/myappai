/**
 * LAYOUT HANDLERS
 * Handle: ADD_SECTION, PUBLISH_BLOG
 */

import { promises as fs } from 'fs';
import path from 'path';
import { CommandResult, PayloadVoiceCommand, VoiceCommand } from '../commands';

/**
 * ADD_SECTION: Add a new section to a page
 * Deterministic: page, component (section name)
 */
export async function handleAddSection(cmd: VoiceCommand): Promise<void> {
  if (cmd.type !== 'ADD_SECTION') return;
  const { page, component } = cmd.payload;
  if (!page || !component) throw new Error('Page and component are required for adding a section');

  const filePath = path.join(process.cwd(), `app/${page}/page.tsx`);

  try {
    let content = await fs.readFile(filePath, 'utf-8');

    const sectionHTML = `
<section className="py-24 px-4 bg-black">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl md:text-6xl font-bold text-white mb-12">${component}</h2>
    <div className="text-lg text-gray-300">[Content for ${component}]</div>
  </div>
</section>`;

    // Insert before closing main tag
    content = content.replace(/(<\/main>)/, `${sectionHTML}\n$1`);
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error: unknown) {
    throw error;
  }
}

/**
 * PUBLISH_BLOG: Create and publish a blog post
 * Deterministic: topic (generates file + frontmatter)
 */
export async function handlePublishBlog(cmd: VoiceCommand): Promise<void> {
  if (cmd.type !== 'PUBLISH_BLOG') return;
  const { topic } = cmd.payload;
  if (!topic) throw new Error('Topic is required for publishing a blog post');

  const date = new Date().toISOString().split('T')[0];
  const slug = topic.toLowerCase().replace(/\s+/g, '-');
  const filePath = path.join(process.cwd(), `app/blog/${slug}.md`);

  try {
    const frontmatter = `---
title: "${topic}"
date: "${date}"
author: "Admin"
published: true
---

# ${topic}

This is a blog post about ${topic}.

## Summary
[Add your content here]

---
Published: ${date}`;

    await fs.writeFile(filePath, frontmatter, 'utf-8');
  } catch (error: unknown) {
    throw error;
  }
}

export async function handleUpdateNav(
  command: Extract<PayloadVoiceCommand, { type: 'UPDATE_NAV' }>
): Promise<CommandResult> {
  const { action, links } = command.payload;
  const targetFile = 'src/app/components/Navigation.tsx';

  try {
    let content = await fs.readFile(targetFile, 'utf-8');

    if (action === 'add') {
      const navLinks = links
        .map((link) => `  { name: '${link}', href: '/${link.toLowerCase()}' }`)
        .join(',\n');
      content = content.replace(/(const navLinks = \[)/, `$1\n${navLinks},`);
    } else if (action === 'remove') {
      links.forEach((link) => {
        const regex = new RegExp(`\\s*{[^}]*name:\\s*['"]${link}['"][^}]*}[,]?`, 'g');
        content = content.replace(regex, '');
      });
    }

    await fs.writeFile(targetFile, content, 'utf-8');

    return {
      success: true,
      files_changed: [targetFile],
    };
  } catch (error: unknown) {
    return {
      success: false,
      files_changed: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

