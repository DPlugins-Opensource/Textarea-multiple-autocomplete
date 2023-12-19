const esbuild = require("esbuild");
const sassPlugin = require("esbuild-sass-plugin").sassPlugin;

async function build() {
    try {
        await esbuild.build({
            entryPoints: ["src/main.js"],
            bundle: true,
            outfile: "dist/main.min.js",
            plugins: [sassPlugin()],
        });
        console.log("Build successful");
    } catch (error) {
        console.error("Error during build:", error);
    }
}

build();
