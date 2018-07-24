// Though this file is optional, there are SO MANY COOL THINGS you can do here.
// Read the docs at https://github.com/nozzle/react-static/blob/master/README.md to learn more!

import axios from "axios";
import cssAssets from "./css";

const paths = require("./paths");

const eslintFormatter = require("react-dev-utils/eslintFormatter");
const jsxCompilationOptions = {
  compilationOptions: {},
  aliases: {},
  optimization: {
    rewriteIdents: true,
    mergeDeclarations: true,
    removeUnusedStyles: true,
    conflictResolution: true,
    enabled: true
  }
};
const CssBlocks = require("@css-blocks/jsx");
const CssBlocksPlugin = require("@css-blocks/webpack").CssBlocksPlugin;
const CssBlockRewriter = new CssBlocks.Rewriter();
const CssBlockAnalyzer = new CssBlocks.Analyzer(
  "unique-name",
  jsxCompilationOptions
);

export default {
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return [
      {
        path: "/Home",
        component: "src/containers/Home"
      },
      {
        path: "/About",
        component: "src/containers/About"
      },
      {
        path: "/blog",
        component: "src/containers/Blog",
        getData: () => ({
          posts
        }),
        children: posts.map(post => ({
          path: `/post/${post.id}`,
          component: "src/containers/Post",
          getData: () => ({
            post
          })
        }))
      },
      {
        is404: true,
        component: "src/containers/404"
      }
    ];
  },
  webpack: (config, { defaultLoaders, stage }) => {
    config.plugins.push(
      new CssBlocksPlugin({
        analyzer: CssBlockAnalyzer,
        outputCssFile: "blocks.css",
        name: "css-blocks",
        compilationOptions: {},
        optimization: {}
      }) // cssAssets({minify: true, inlineSourceMaps: false})
    );
    config.resolve.extensions = [
      ".web.js",
      ".mjs",
      ".js",
      ".json",
      ".web.jsx",
      ".jsx",
      ".ts",
      ".tsx"
    ];
    config.module.rules = [
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx|mjs)$/,
        enforce: "pre",
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve("eslint")
            },
            loader: require.resolve("eslint-loader")
          }
        ],
        include: paths.appSrc
      },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          {
            test: /\.[j|t]s(x?)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve("babel-loader"),
                options: {
                  presets: [require.resolve("babel-preset-react-app")],
                  cacheDirectory: true,
                  compact: true
                }
              },

              // Run the css-blocks plugin in its own dedicated loader because the react-app preset
              // steps on our transforms' feet. This way, we are guaranteed a clean pass before any
              // other transforms are done.
              {
                loader: require.resolve("babel-loader"),
                options: {
                  plugins: [
                    require("@css-blocks/jsx/dist/src/transformer/babel").makePlugin(
                      { rewriter: CssBlockRewriter }
                    )
                  ],
                  cacheDirectory: true,
                  compact: true,
                  parserOpts: {
                    plugins: [
                      "jsx",
                      "doExpressions",
                      "objectRestSpread",
                      "decorators",
                      "classProperties"
                    ]
                  }
                }
              },

              // The JSX Webpack Loader halts loader execution until after all blocks have
              // been compiled and template analyses has been run. StyleMapping data stored
              // in shared `rewriter` object.
              {
                loader: require.resolve("@css-blocks/webpack/dist/src/loader"),
                options: {
                  analyzer: CssBlockAnalyzer,
                  rewriter: CssBlockRewriter
                }
              }
            ]
          }, // defaultLoaders.cssLoader,
          // defaultLoaders.jsLoader,
          // defaultLoaders.fileLoader,

          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // it's runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.[j|t]s(x?)$/, /\.html$/, /\.json$/],
            loader: require.resolve("file-loader"),
            options: {
              name: "static/media/[name].[hash:8].[ext]"
            }
          }
        ]
      } // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ];
  }
};
