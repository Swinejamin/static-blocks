import React from "react";
import axios from "axios";
import cssAssets from "./css";
const cssFilename = "static/css/[name].[contenthash:8].css";
import autoprefixer from "autoprefixer";
import paths from "./paths";
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === "./";
const extractTextPluginOptions = shouldUseRelativeAssetPaths // Making sure that the publicPath goes back to to build folder.
  ? { publicPath: Array(cssFilename.split("/").length).join("../") }
  : {};
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

const { Rewriter, Analyzer } = require("@css-blocks/jsx");
const { CssBlocksPlugin } = require("@css-blocks/webpack");
const cssBlocksRewriter = require("@css-blocks/jsx/dist/src/transformer/babel");
const rewriter = new Rewriter();
const analyzer = new Analyzer(
  __dirname + "/src/index.jsx",
  jsxCompilationOptions
);

export default {
  extractCssChunks: true,
  Document: ({ Html, Head, Body, children, siteData, renderMeta }) => (
    <Html lang="en-US">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="css-blocks.css" />
      </Head>
      <Body>{children}</Body>
    </Html>
  ),
  getRoutes: async () => {
    const { data: posts } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts"
    );
    return [
      {
        path: "/",
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
    config.entry = `${__dirname}/src/index.jsx`;
    config.plugins.push(
      new CssBlocksPlugin({
        analyzer: analyzer,
        outputCssFile: "css-blocks.css",
        name: "css-blocks",
        compilationOptions: {},
        optimization: {}
      }),
      // cssAssets({ minify: true, inlineSourceMaps: false }),

      new ExtractCssChunks({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
      })
    );
    config.resolve.extensions = [
      ".scss",
      ".css",
      ".web.js",
      ".mjs",
      ".js",
      ".json",
      ".web.jsx",
      ".jsx",
      ".ts",
      ".tsx"
    ];
    // config.devtool= shouldUseSourceMap ? 'source-map' : false,

    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253

    // config.resolve.modules = ["node_modules", paths.appNodeModules].concat(
    //   // It is guaranteed to exist because we tweak it in `env.js`
    //   process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    // );

    config.module.rules = [
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // defaultLoaders.jsLoader,
          // defaultLoaders.fileLoader,
          // defaultLoaders.cssLoader,
          {
            test: /\.(s?)css$/,
            use: [ExtractCssChunks.loader, "css-loader"]
          },

          {
            test: /\.[j|t]s(x?)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: require.resolve("babel-loader"),
                options: {
                  presets: ["env", "react", "stage-2"],
                  cacheDirectory: true,
                  compact: true
                }
              },
              {
                loader: require.resolve("babel-loader"),
                options: {
                  babelrc: false,
                  plugins: [cssBlocksRewriter.makePlugin({ rewriter })],
                  parserOpts: {
                    plugins: ["jsx"]
                  }
                }
              },
              {
                loader: require.resolve("@css-blocks/webpack/dist/src/loader"),
                options: {
                  analyzer,
                  rewriter
                }
              }
            ]
          }
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          // {
          //   // Exclude `js` files to keep "css" loader working as it injects
          //   // it's runtime that would otherwise processed through "file" loader.
          //   // Also exclude `html` and `json` extensions so they get processed
          //   // by webpacks internal loaders.
          //   exclude: [/\.[j|t]s(x?)$/, /\.html$/, /\.json$/],
          //   loader: require.resolve("file-loader"),
          //   options: { name: "static/media/[name].[hash:8].[ext]" }
          // }
          // ]
        ]
      }
    ]; // ** STOP ** Are you adding a new loader?
    // Make sure to add the new loader(s) before the "file" loader.
  }
};
