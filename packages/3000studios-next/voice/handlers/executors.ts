/**
 * MUTATION EXECUTOR
 * Applies queued voice mutations to actual files
 */

import fs from 'fs';
import path from 'path';

interface ExecutionResult {
  success: boolean;
  message: string;
  filesChanged?: string[];
}

/**
 * Execute UPDATE_TEXT mutation
 */
export async function executeUpdateText(newText: string): Promise<ExecutionResult> {
  try {
    const homepage = path.join(process.cwd(), 'app', 'page.tsx');
    let content = fs.readFileSync(homepage, 'utf-8');

    // Find and replace the main headline
    const headlinePattern = /<h1[^>]*>(.*?)<\/h1>/i;
    if (headlinePattern.test(content)) {
      content = content.replace(
        headlinePattern,
        `<h1 className="text-6xl font-bold mb-6">${newText}</h1>`
      );
      fs.writeFileSync(homepage, content, 'utf-8');

      return {
        success: true,
        message: `Updated headline to: "${newText}"`,
        filesChanged: ['app/page.tsx'],
      };
    }

    return {
      success: false,
      message: 'Could not find headline to update',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Error updating text: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Execute ADD_MEDIA mutation
 */
export async function executeAddMedia(
  mediaUrl: string,
  type: 'video' | 'image'
): Promise<ExecutionResult> {
  try {
    const homepage = path.join(process.cwd(), 'app', 'page.tsx');
    let content = fs.readFileSync(homepage, 'utf-8');

    // Add media before the main content section
    const marker = '{/* Main Content */}';
    const mediaComponent =
      type === 'video'
        ? `\n      {/* Voice-Added Media */}\n      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">\n        <video src="${mediaUrl}" autoPlay loop muted playsInline className="w-full h-full object-cover" />\n      </div>\n`
        : `\n      {/* Voice-Added Media */}\n      <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8">\n        <img src="${mediaUrl}" alt="Voice added content" className="w-full h-full object-cover" />\n      </div>\n`;

    if (content.includes(marker)) {
      content = content.replace(marker, marker + mediaComponent);
      fs.writeFileSync(homepage, content, 'utf-8');

      return {
        success: true,
        message: `Added ${type} from ${mediaUrl}`,
        filesChanged: ['app/page.tsx'],
      };
    }

    return {
      success: false,
      message: 'Could not find insertion point for media',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Error adding media: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Execute ADD_SECTION mutation
 */
export async function executeAddSection(title: string, content: string): Promise<ExecutionResult> {
  try {
    const homepage = path.join(process.cwd(), 'app', 'page.tsx');
    let pageContent = fs.readFileSync(homepage, 'utf-8');

    // Find the closing tag of the main container
    const sectionHtml = `\n      {/* Voice-Added Section */}\n      <section className="py-24 px-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl">\n        <div className="max-w-4xl mx-auto">\n          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">\n            ${title}\n          </h2>\n          <p className="text-xl text-gray-300 leading-relaxed">\n            ${content}\n          </p>\n        </div>\n      </section>\n`;

    // Add before the closing main tag
    const closingMain = '</main>';
    if (pageContent.includes(closingMain)) {
      pageContent = pageContent.replace(closingMain, sectionHtml + '\n    ' + closingMain);
      fs.writeFileSync(homepage, pageContent, 'utf-8');

      return {
        success: true,
        message: `Added section: "${title}"`,
        filesChanged: ['app/page.tsx'],
      };
    }

    return {
      success: false,
      message: 'Could not find insertion point for section',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Error adding section: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Execute CHANGE_STYLE mutation
 */
export async function executeChangeStyle(
  property: string,
  value: string
): Promise<ExecutionResult> {
  try {
    const cssFile = path.join(process.cwd(), 'app', 'globals.css');
    let content = fs.readFileSync(cssFile, 'utf-8');

    // Convert property name to CSS variable format
    const cssVar = property.startsWith('--') ? property : `--${property}`;

    // Check if variable exists
    const varPattern = new RegExp(`${cssVar}:\\s*[^;]+;`, 'g');
    if (varPattern.test(content)) {
      // Update existing variable
      content = content.replace(varPattern, `${cssVar}: ${value};`);
    } else {
      // Add new variable to :root
      const rootPattern = /:root\s*{/;
      if (rootPattern.test(content)) {
        content = content.replace(rootPattern, `:root {\n  ${cssVar}: ${value};`);
      }
    }

    fs.writeFileSync(cssFile, content, 'utf-8');

    return {
      success: true,
      message: `Updated ${cssVar} to ${value}`,
      filesChanged: ['app/globals.css'],
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Error updating style: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Execute PUBLISH_BLOG mutation
 */
export async function executePublishBlog(
  title: string,
  body: string,
  slug?: string
): Promise<ExecutionResult> {
  try {
    // Generate slug if not provided
    const postSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    // Create blog post directory
    const blogDir = path.join(process.cwd(), 'app', 'blog', postSlug);

    // Check if directory exists
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    // Create page.tsx file
    const pageContent = `export default function BlogPost() {
  return (
    <article className="max-w-4xl mx-auto py-24 px-6">
      <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
        ${title}
      </h1>
      <div className="prose prose-invert prose-lg max-w-none">
        ${body
          .split('\n\n')
          .map((para) => `<p className="mb-4 text-gray-300 leading-relaxed">${para}</p>`)
          .join('\n        ')}
      </div>
    </article>
  );
}
`;

    fs.writeFileSync(path.join(blogDir, 'page.tsx'), pageContent, 'utf-8');

    return {
      success: true,
      message: `Published blog post: "${title}" at /blog/${postSlug}`,
      filesChanged: [`app/blog/${postSlug}/page.tsx`],
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: `Error publishing blog: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

