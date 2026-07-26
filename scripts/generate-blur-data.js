const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_ROOT = path.join(__dirname, '../public/images');
const GALLERY_OUTPUT = path.join(__dirname, '../src/constants/blurData.json');
const ALL_OUTPUT = path.join(__dirname, '../src/constants/blurDataAll.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function generateBlurDataURL(imagePath) {
  try {
    const buffer = await sharp(imagePath)
      .resize(10, 10, { fit: 'inside' })
      .blur()
      .toBuffer();
    
    const base64 = buffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error.message);
    return null;
  }
}

function walkDir(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(full));
    } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

async function generateAllBlurData() {
  console.log('🔄 Generating blur placeholders for all images...\n');
  
  const allFiles = walkDir(IMAGES_ROOT).sort();

  const galleryBlur = {};
  const allBlur = {};
  let processed = 0;

  for (const filePath of allFiles) {
    const blurDataURL = await generateBlurDataURL(filePath);
    if (!blurDataURL) {
      console.log(`✗ Failed ${filePath}`);
      continue;
    }

    processed++;
    const relativePath = '/' + path.relative(path.join(__dirname, '../public'), filePath);
    allBlur[relativePath] = blurDataURL;

    const fileName = path.basename(filePath);
    if (filePath.includes('/gallery/') && fileName.startsWith('gallery-')) {
      galleryBlur[fileName] = blurDataURL;
    }

    console.log(`✓ ${relativePath} (${processed}/${allFiles.length})`);
  }

  fs.writeFileSync(GALLERY_OUTPUT, JSON.stringify(galleryBlur, null, 2));
  fs.writeFileSync(ALL_OUTPUT, JSON.stringify(allBlur, null, 2));
  
  console.log(`\n✅ Generated blur data for ${processed} images`);
  console.log(`📁 Gallery: ${GALLERY_OUTPUT}`);
  console.log(`📁 All:     ${ALL_OUTPUT}`);
}

generateAllBlurData().catch(console.error);
