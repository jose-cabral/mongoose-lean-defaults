# new-mongoose-lean-defaults

Attach defaults to the results of mongoose queries when using [`.lean()`](https://mongoosejs.com/docs/api.html#query_Query-lean).

Highly inspired by [mongoose-lean-virtuals](https://github.com/vkarpov15/mongoose-lean-virtuals).

Fork of [mongoose-lean-defaults](https://github.com/douglasgabr/mongoose-lean-defaults).

[![Run Tests](https://github.com/jose-cabral/mongoose-lean-defaults/actions/workflows/run-tests.yml/badge.svg?branch=main&event=push)](https://github.com/jose-cabral/mongoose-lean-defaults/actions/workflows/run-tests.yml)
[![Node.js Package](https://github.com/jose-cabral/mongoose-lean-defaults/actions/workflows/publish-to-npm.yml/badge.svg?branch=main&event=release)](https://github.com/jose-cabral/mongoose-lean-defaults/actions/workflows/npmpublish.yml)

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
