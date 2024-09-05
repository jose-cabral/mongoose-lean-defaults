# new-mongoose-lean-defaults

Forked from [mongoose-lean-defaults](https://github.com/douglasgabr/mongoose-lean-defaults) because that repo is stalled.

Attach defaults to the results of mongoose queries when using [`.lean()`](https://mongoosejs.com/docs/api.html#query_Query-lean).


![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/jose-cabral/mongoose-lean-defaults/.github%2Fworkflows%2Frun-tests.yml?branch=main&label=tests)
![GitHub Release](https://img.shields.io/github/v/release/jose-cabral/mongoose-lean-defaults?link=https%3A%2F%2Fgithub.com%2Fjose-cabral%2Fmongoose-lean-defaults%2Freleases)

## Changelog

### 3.0.4

🪲 **bugfixes**

* `defaults` were being applied to sub-schemas even if they were `not required` and not set
    * this resulted it non required fields to be set because of nested `defaults`

## Install

```sh
npm install --save new-mongoose-lean-defaults
```

or

```sh
yarn add new-mongoose-lean-defaults
```

## Usage

```javascript
import mongooseLeanDefaults from 'new-mongoose-lean-defaults';
// const mongooseLeanDefaults = require('new-mongoose-lean-defaults').default;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Bob',
  },
});
// documents will only have `name` field on database

// Later
const updatedUserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Bob',
  },
  country: {
    type: String,
    default: 'USA',
  },
});
// `.find().lean()` will return documents without `country` field

updatedUserSchema.plugin(mongooseLeanDefaults);

// You must pass `defaults: true` to `.lean()`
const bob = await UserModel.findOne().lean({ defaults: true });
/**
 * bob = {
 *    _id: ...,
 *    name: 'Bob',
 *    country: 'USA'
 * }
 */
```
