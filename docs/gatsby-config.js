module.exports = {
  pathPrefix: "/ui-studio",
  siteMetadata: {
    siteTitle: `UI Studio Docs`,
    defaultTitle: `UI Studio Docs`,
    siteTitleShort: `UI Studio Docs`,
    siteDescription: `Documentation for UI Studio`,
    siteUrl: `https://neb42.github.io/ui-studio`,
    siteAuthor: `@neb42`,
    siteImage: `/banner.png`,
    siteLanguage: `en`,
    themeColor: `#8257E6`,
    basePath: `/`,
  },
  flags: { PRESERVE_WEBPACK_CACHE: true },
  plugins: [
    {
      resolve: `@rocketseat/gatsby-theme-docs`,
      options: {
        configPath: `src/config`,
        docsPath: `src/docs`,
        repositoryUrl: `https://github.com/neb42/ui-studio`,
        baseDir: `docs`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `UI Studio`,
        short_name: `UI Studio`,
        start_url: `/`,
        background_color: `#ffffff`,
        display: `standalone`,
        icon: `static/favicon.png`,
      },
    },
    `gatsby-plugin-sitemap`,
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `YOUR_ANALYTICS_ID`,
    //   },
    // },
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://neb42.github.io/ui-studio/`,
      },
    },
    `gatsby-plugin-offline`,
  ],
};
