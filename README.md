# format-as-currency

Angular directive to format an input as a currency as the user types. Like [autoNumeric](https://github.com/BobKnothe/autoNumeric) for Angular.

# Demo

http://bcherny.github.io/format-as-currency/demo

# Installation

Install via bower or NPM:

- Bower: `bower install --save format-as-currency`
- NPM: `npm install --save format-as-currency`

# Usage

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