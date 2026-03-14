const fs = require('fs');
const path = require('path');

const blurDataPath = path.join(__dirname, '../src/constants/blurData.json');
const blurData = JSON.parse(fs.readFileSync(blurDataPath, 'utf8'));

const colors = ["#ff0088", "#dd00ee", "#9911ff", "#0d63f8", "#0cdcf7"];

const galleryItems = Object.keys(blurData)
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0]);
    const numB = parseInt(b.match(/\d+/)[0]);
    return numA - numB;
  })
  .map((filename, index) => {
    const id = index + 1;
    return {
      id,
      image: `/images/gallery/${filename}`,
      title: `Gallery ${id}`,
      color: colors[index % colors.length],
      blurDataURL: blurData[filename]
    };
  });

const output = `export const galleryItems = ${JSON.stringify(galleryItems, null, 2)};
`;

const outputPath = path.join(__dirname, '../src/constants/galleryData.js');
fs.writeFileSync(outputPath, output);

console.log(`✅ Updated galleryData.js with ${galleryItems.length} items including blur data`);
