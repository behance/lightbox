# Lightbox [![Build Status](https://img.shields.io/travis/behance/lightbox.svg)](http://travis-ci.org/behance/lightbox)

A component, which opens an image or a set of images in their own scrollable view with the goal of removing distractions from the page.

### Cutting a Release

 1. Before cutting a new release, make sure your changes are *merged*, your *master* branch is *up to date (pull from upstream)*, and you're on your *`master`* branch.
 2. To create a new release, use `npm version major`, `npm version minor`, or `npm version patch` to update package.json and create a release commit and git version tag.
 3. Finally, use `git push upstream master --tags` (assuming your `upstream` is pointed at behance/lightbox) to push the version commit and tags to the repo.
 4. Run `npm publish --access public`

## License

[Apache-2.0](/LICENSE)
