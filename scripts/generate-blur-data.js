const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const GALLERY_DIR = path.join(__dirname, '../public/images/gallery');
const OUTPUT_FILE = path.join(__dirname, '../src/constants/blurData.json');

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

async function generateAllBlurData() {
  console.log('🔄 Generating blur placeholders...\n');
  
  const files = fs.readdirSync(GALLERY_DIR)
    .filter(file => file.startsWith('gallery-') && file.endsWith('.jpg'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });

  const blurData = {};
  let processed = 0;

  for (const file of files) {
    const filePath = path.join(GALLERY_DIR, file);
    const blurDataURL = await generateBlurDataURL(filePath);
    
    if (blurDataURL) {
      blurData[file] = blurDataURL;
      processed++;
      console.log(`✓ Processed ${file} (${processed}/${files.length})`);
    } else {
      console.log(`✗ Failed ${file}`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(blurData, null, 2));
  
  console.log(`\n✅ Generated blur data for ${processed} images`);
  console.log(`📁 Output: ${OUTPUT_FILE}`);
}

generateAllBlurData().catch(console.error);
