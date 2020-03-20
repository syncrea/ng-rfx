const ghpages = require('gh-pages');
ghpages.publish('dist/rfx-docs', {history: false}, err => {
  if (err) {
    console.error(`There was an error: ${err}`);
  } else {
    console.log('Published')
  }
});
