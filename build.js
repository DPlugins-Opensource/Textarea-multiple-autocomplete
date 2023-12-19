const esbuild = require("esbuild");

async function build() {
    try {
        await esbuild.build({
            entryPoints: ["src/main.js"],
            bundle: true,
            // minify: true,
            outfile: "dist/main.min.js",
        });
        console.log("Build successful");
    } catch (error) {
        console.error("Error during build:", error);
    }
}

build();
