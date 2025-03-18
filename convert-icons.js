const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Ensure the SVG file exists
const svgPath = path.join(__dirname, "public", "logo.svg");
if (!fs.existsSync(svgPath)) {
  console.error("SVG file not found at:", svgPath);
  process.exit(1);
}

// Define the sizes we need
const sizes = [
  { name: "favicon.ico", size: "64:64" },
  { name: "logo192.png", size: "192:192" },
  { name: "logo512.png", size: "512:512" },
];

// Convert SVG to each size
sizes.forEach(({ name, size }) => {
  const outputPath = path.join(__dirname, "public", name);
  const extension = path.extname(name).substring(1);

  try {
    // For favicon.ico, we need to convert to PNG first and then to ICO
    if (extension === "ico") {
      const tempPngPath = path.join(__dirname, "public", "temp-favicon.png");

      // Convert SVG to PNG
      execSync(`svgexport ${svgPath} ${tempPngPath} ${size}`);

      // Convert PNG to ICO using ImageMagick if available
      try {
        execSync(`convert ${tempPngPath} ${outputPath}`);
        console.log(`Created ${name}`);

        // Clean up temp file
        fs.unlinkSync(tempPngPath);
      } catch (error) {
        console.log(`Could not convert to ICO. Using PNG as favicon instead.`);
        // If ImageMagick is not available, just use the PNG as favicon
        fs.copyFileSync(
          tempPngPath,
          path.join(__dirname, "public", "favicon.png")
        );
        console.log(`Created favicon.png instead of favicon.ico`);
      }
    } else {
      // Direct SVG to PNG conversion
      execSync(`svgexport ${svgPath} ${outputPath} ${size}`);
      console.log(`Created ${name}`);
    }
  } catch (error) {
    console.error(`Error creating ${name}:`, error.message);
  }
});

console.log("Icon conversion complete!");
