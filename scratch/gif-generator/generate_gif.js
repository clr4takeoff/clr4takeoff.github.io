const puppeteer = require('puppeteer');
const GIFEncoder = require('gifencoder');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 600;
const SWEEP_MS = 3000;
const FPS = 20;
const TOTAL_FRAMES = (SWEEP_MS / 1000) * FPS;
const DELAY = 1000 / FPS;

async function createGif(theme) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport to exact size (600x600). We set deviceScaleFactor to 2 to get high-res images,
  // but gifencoder canvas will just scale it down or keep it high-res. 
  // Let's keep the GIF at 600x600 to keep file size reasonable.
  await page.setViewport({ width: W, height: W, deviceScaleFactor: 1 });
  
  const htmlPath = 'file://' + path.resolve(__dirname, 'standalone_radar.html');
  await page.goto(htmlPath);
  
  // Wait for init
  await page.evaluate(async () => {
    await window.initPromise;
  });

  // Set theme
  await page.evaluate(async (t) => {
    await window.setTheme(t);
  }, theme);
  
  // Wait a little bit for fonts/SVGs to settle
  await new Promise(r => setTimeout(r, 500));

  const encoder = new GIFEncoder(W, W);
  const outPath = path.resolve(__dirname, `../../assets/images/interest_radar_${theme}.gif`);
  encoder.createReadStream().pipe(fs.createWriteStream(outPath));
  encoder.start();
  encoder.setRepeat(0);   
  encoder.setDelay(DELAY);  
  encoder.setQuality(10); 

  const canvas = createCanvas(W, W);
  const ctx = canvas.getContext('2d');

  console.log(`Generating ${theme} GIF...`);
  
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const ts = i * DELAY;
    await page.evaluate((time) => {
      window.renderFrame(time);
    }, ts);
    
    // Screenshot to buffer
    const buffer = await page.screenshot({ type: 'png', omitBackground: true });
    
    // Load into canvas
    const img = await loadImage(buffer);
    
    // Clear canvas
    ctx.clearRect(0, 0, W, W);
    
    // Draw background color to avoid transparent GIF ghosting issues, 
    // or keep transparent if encoder supports it. 
    // It's safer to have a solid background for GIFs.
    if (theme === 'dark') {
      ctx.fillStyle = '#181b22';
    } else {
      ctx.fillStyle = '#ffffff';
    }
    ctx.fillRect(0, 0, W, W);
    
    ctx.drawImage(img, 0, 0, W, W);
    
    encoder.addFrame(ctx);
    
    if (i % 10 === 0) console.log(`  Frame ${i}/${TOTAL_FRAMES}`);
  }
  
  encoder.finish();
  await browser.close();
  console.log(`Finished ${theme} GIF at ${outPath}`);
}

(async () => {
  await createGif('light');
  await createGif('dark');
})();
