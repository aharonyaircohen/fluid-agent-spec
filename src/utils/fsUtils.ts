import * as fs from 'fs';
import * as path from 'path';

/**
 * Ensures a directory exists, creating it recursively if needed
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Checks if a path exists
 */
export function pathExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Copies a file from source to destination
 */
export function copyFile(src: string, dest: string, force: boolean = false): boolean {
  if (!force && fs.existsSync(dest)) {
    return false; // File exists and force is not enabled
  }

  const destDir = path.dirname(dest);
  ensureDir(destDir);

  fs.copyFileSync(src, dest);
  return true;
}

/**
 * Recursively copies a directory from source to destination
 * @param src Source directory path
 * @param dest Destination directory path
 * @param force If true, overwrite existing files
 * @returns Object containing copied and skipped file counts
 */
export function copyDir(
  src: string,
  dest: string,
  force: boolean = false
): { copied: number; skipped: number } {
  let copied = 0;
  let skipped = 0;

  ensureDir(dest);

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      const result = copyDir(srcPath, destPath, force);
      copied += result.copied;
      skipped += result.skipped;
    } else {
      const wasCopied = copyFile(srcPath, destPath, force);
      if (wasCopied) {
        copied++;
      } else {
        skipped++;
      }
    }
  }

  return { copied, skipped };
}

/**
 * Lists all subdirectories in a directory
 */
export function listSubdirectories(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
}

/**
 * Reads a JSON file and returns its parsed content
 */
export function readJsonFile<T>(filePath: string): T {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content) as T;
}
