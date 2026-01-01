#!/usr/bin/env node

/**
 * Rename Gemini-generated gallery images to clean sequential names
 * Run: node scripts/rename-gallery-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');

// Get all image files
const files = fs.readdirSync(galleryDir)
  .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
  .sort();

console.log(`Found ${files.length} images to rename:\n`);

// Rename each file
files.forEach((oldName, index) => {
  const ext = path.extname(oldName).toLowerCase();
  const num = String(index + 1).padStart(2, '0');
  const newName = `gallery-${num}${ext}`;

  const oldPath = path.join(galleryDir, oldName);
  const newPath = path.join(galleryDir, newName);

  // Skip if already renamed
  if (oldName === newName) {
    console.log(`  [skip] ${oldName} (already named)`);
    return;
  }

  // Check if target exists
  if (fs.existsSync(newPath)) {
    console.log(`  [skip] ${oldName} -> ${newName} (target exists)`);
    return;
  }

  fs.renameSync(oldPath, newPath);
  console.log(`  [ok] ${oldName} -> ${newName}`);
});

console.log('\nDone! Images renamed successfully.');
