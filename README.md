# format-as-currency

[![Build Status][build]](https://travis-ci.org/bcherny/format-as-currency) [![Coverage Status][coverage]](https://coveralls.io/r/bcherny/format-as-currency) ![][bower] [![npm]](https://www.npmjs.com/package/format-as-currency) [![cc0]](http://creativecommons.org/about/cc0)

[build]: https://img.shields.io/circleci/project/bcherny/format-as-currency.svg?branch=master&style=flat-square
[coverage]: http://img.shields.io/coveralls/bcherny/format-as-currency.svg?branch=master&style=flat-square
[bower]: https://img.shields.io/bower/v/format-as-currency.svg?style=flat-square
[npm]: https://img.shields.io/npm/v/format-as-currency.svg?style=flat-square
[cc0]: https://licensebuttons.net/p/zero/1.0/80x15.png

Angular directive to format an input as a currency as the user types. Like [autoNumeric](https://github.com/BobKnothe/autoNumeric) for Angular.

## Demo

http://bcherny.github.io/format-as-currency/demo

## Installation

Install via bower or NPM:

- Bower: `bower install --save format-as-currency`
- NPM: `npm install --save format-as-currency`

## Usage

```html
<div ng-controller="myController">
  <input
    format-as-currency
    ng-model="value"
    type="text"
  >
</div>

<script src="bower_components/angular/angular.js"></script>
<script src="bower_components/format-as-currency/format-as-currency.js"></script>
<script>
  angular
  .module('myModule', [
    'bcherny/formatAsCurrency'
  ])
  .controller('myController', function ($scope) {
    $scope.value = '' // currency input value
  })
</script>
```

# Running the tests

```sh
npm test
```