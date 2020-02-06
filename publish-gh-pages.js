const ghpages = require('gh-pages');
ghpages.publish('dist/rfx-docs', err => {
  console.error(`There was an error: ${err}`);
});
