This project was created to build an interactive graph displaying Liferay's modules schema.

**We use the following technologies:**
* For the cli side:
    * Fìglet
    * Chalk
    * Inquirer
<br>
* For the script side:
    * fdir
    * fs
    * rimraf
    * xml2js
<br>
* For the diagrams side mainly:
    * React / React-dom [License](https://github.com/facebook/react/blob/master/LICENSE)
    * three-spritetext [License](https://github.com/vasturiano/three-spritetext/blob/master/LICENSE)
    * react-force-graph [License](https://github.com/vasturiano/react-force-graph/blob/master/LICENSE)
    * eslint
    * babel
    * webpack
    * And a lot of other libs, you can find [Here](https://github.com/liferay-commerce/db-schema-viewer/blob/master/diagram-db-react/package.json)
<br>
* and <u>Yarn workspaces</u> to rule them all


## Available Scripts

In the main project directory, you can run firstly:

### `yarn cli`

to run the models generator.

The generator will ask you
1) to type/paste the Liferay's project path  
2) to choose which path you want to crawl to extrapolate the models from

If all goes well you can run 

### `yarn diagram`

to start the site in devoplent mode ([http://localhost:3000](http://localhost:3000) to view it in the browser). 
The page will reload if you make edits.<br>
You will also see any lint errors in the console

<u>otherwise</u>


### `yarn build`

to build the static files contained in `/diagram-db-react/build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
