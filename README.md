# OuterSpatial Builder

OuterSpatial Builder (from hereon referred to as "Builder") is a graphical interface that can be used to build maps with the [OuterSpatial.js library](https://github.com/trailheadlabs/outerspatial.js). Builder is intended to be a quick start for developing and deploying maps to the web. It is not intended to cover every use case - and it never will. Those who want to add advanced functionality or customizations to their map will need to use OuterSpatial.js's API.

That said, output from Builder should provide a good base starting point for all maps - even those that require additional customizations.

## Thanks

Initial development on this project was done by the U.S. National Park Service's [NPMap team](https://www.nps.gov/npmap/) and called NPMap Builder. The agency recently made the repository private, but luckily made the code available in the public domain so we ([Trailhead Labs](https://www.trailheadlabs.com)) have decided to host it and push development forward.

## Build

You can create a production build with minified and combined JavaScript and CSS by using Grunt:

1. Install Node
2. `npm install`
3. `grunt build`

The build will be created in the `_site` directory.

## Status

OuterSpatial Builder is a work-in-progress. Consider the code alpha and the feature set incomplete.
