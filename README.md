# vuex-i18n-typed

Started as a way to get typed static wrappers around translation files for use with vuex i18n, but since it uses [handlebarsjs](http://handlebarsjs.com) and [node-json-transform](https://github.com/bozzltron/node-json-transform) under the hood it became much more.

## Getting Started

Source code: [vuex-i18n-typed](https://github.com/Odiriuss/vuex-i18n-typed)

Download and install npm packages by running npm install in the root directory.
Start by running the index.js file in the src folder.

## Prerequisites

Node.js

## Use

There are 2 commands available, emit and watch.

Emit will scan the source files from the provided source folder, if cleaner flag set it will load the module in that path and apply the clean function, scan the templates folder and the transforms folder (optional), if it finds any templates it will search for the transforms with the same extension and apply if any, finally it will emit the files to the destination folder or to the folders set by the extension destination flag. 

```
node index.js emit \..\tests\src_translations \..\tests\destination --templates \..\tests\templates --transforms \..\tests\transforms --lang en --extension-destinations ts=\..\tests\destination\ts cs=\..\tests\destination\cs
```

For the following source: general.en.json

```json
[
    {
      "Key": "_30days",
      "Value": "30 days",
      "LastModifiedUtcTime": "2018-09-27T06:36:51.4913332Z",
      "Comment": ""
    },
    {
      "Key": "_7days",
      "Value": "7 days",
      "LastModifiedUtcTime": "2018-09-27T06:36:51.4913332Z",
      "Comment": ""
    }
]
```

With the following transform: transform.ts.js -- ts sets the extension to apply the transform to

```javascript
const map = {
    list : 'translations',
    item: {
        Key: 'Key',
        Value: 'Value'
     },
     each: function(item){
        item[item.Key] = item.Value;
        delete item['Key'];
        delete item['Value'];

        return item;
    }
};

module.exports = { map };
```

And the following template: template.ts.handlebars

```
import Vue from 'vue';

export class {{className}} {
{{#each data}}
{{#each .}}
    /** En translation: {{this}} */
    get {{@key}}(): string | undefined {
        return Vue.i18n.translate('{{@key}}', Vue.i18n.locale());
    }
{{/each}}
{{/each}}
}
```

Will output: General.ts

```typescript
import Vue from 'vue';

export class General {
    /** En translation: 30 days */
    get _30days(): string | undefined {
        return Vue.i18n.translate('_30days', Vue.i18n.locale());
    }
    /** En translation: 7 days */
    get _7days(): string | undefined {
        return Vue.i18n.translate('_7days', Vue.i18n.locale());
    }
}
```

Watch command emmits if a file from the source folder changes.

```
node index.js watch \..\tests\src_translations \..\tests\destination --templates \..\tests\templates --transforms \..\tests\transforms --lang en --extension-destinations ts=\..\tests\destination\ts cs=\..\tests\destination\cs
```

## Options

| Opiton        | Alias           | Optional | Type | Description  |
| ------------- |:-------------:| -----:|-----:|-----:|
| templates | t | no | string | Templates folder where the source files are located.
| cleaner | c | yes | string | Path to the cleaner module which is used to clean source files. Must export cleanSource function which accepts the content as a string and outputs a JSON object.
| transforms | tf | yes | string | Transforms folder where files to be used for transforming source files are located. All files in the folder have to export a map object so that we can import them correctly.
| extension-destinations | ed | yes | string array |Sets the destination for each extension.
| lang      | l | yes | string | Sets the language which will trigger the emit of the files defined in classes option. |

You can define template extensions and output path in the template itself. Just add a commented JSON object to the first line of the template (which will be removed in the output), for example:

/** { "destination": "\..\tests\destination\templateDestination", "extension": "d.ts" } */

Destination that the template will be saved to is determined in this order (by priority descending):  

1. config object in the first line of template with destination property
2. extension destination flag is set for the template extension
3. destination folder

Output file extension is determined in this order (by priority descending):  

1. config object in the first line of template with the extension property
2. from template name, example: default.ts.handlebars (extension is .ts)

If you don't want to generate an output for each of your source files you can tag the template as a class template, all you need to do is name the first part of your template class. For example: class.ts.handlebars. It will generate output only when the source file contains the language set in the lang flag, default for lang is en.

## Built With

* [handlebarsjs](http://handlebarsjs.com/)
* [node-log-timestamp](https://github.com/bahamas10/node-log-timestamp#readme)
* [node-md5](https://github.com/pvorb/node-md5#readme)
* [node-json-transform](https://github.com/bozzltron/node-json-transform)
* [yargs](http://yargs.js.org/)
* [chokidar](https://github.com/paulmillr/chokidar)

## Authors

* **[Odiriuss](https://github.com/Odiriuss)**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details