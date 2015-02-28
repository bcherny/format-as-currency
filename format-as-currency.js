angular
.module('bcherny/formatAsCurrency', [])
.service('formatAsCurrencyUtilities', function () {

  // (haystack: String, needles: Array<String>) => Number
  // eg. ('foo', 'o') => 2
  this.occurrences = function (haystack, needles) {

    if (!angular.isString(haystack)) {
      throw new TypeError ('formatAsCurrencyUtilities#occurences expects its 1st argument to be a String, but was given ' + haystack)
    }

    if (!angular.isArray(needles)) {
      throw new TypeError ('formatAsCurrencyUtilities#occurences expects its 2nd argument to be an Array, but was given ' + needles)
    }

    needles.forEach(function (needle, n) {
      if (!angular.isString(needle)) {
        throw new TypeError ('formatAsCurrencyUtilities#occurences expects needles to be Strings, but needle #' + n + ' is ' + needle)
      }
    })

    return needles

      // get counts
      .map(function (needle) {
        _needle = needle
          .replace(/\[/g, '\\[')
          .replace(/\]/g, '\\]')
        return (
          haystack.match(new RegExp('[' + _needle + ']', 'g')) || []
        ).length
      })

      // sum counts
      .reduce(function (prev, cur) {
        return prev + cur
      })
  }

  // (currencyString: String) => Number
  // eg. "$123.00" => 123.00
  this.toFloat = function (currencyString) {

    if (!angular.isString(currencyString)) {
      throw new TypeError ('formatAsCurrencyUtilities#toFloat expects its 1st argument to be a String, but was given ' + currencyString)
    }

    return parseFloat(currencyString.replace(/(\$|\,)+/g, ''), 10)
  }

})
.directive('formatAsCurrency', function ($filter, $locale, formatAsCurrencyUtilities) {

  const CURRENCY_SYMBOL = $locale.NUMBER_FORMATS.CURRENCY_SYM

  var util = formatAsCurrencyUtilities

  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, _, ngModel) {

      ngModel.$formatters.push(function (value) {
        return $filter('currency')(value)
      })

      ngModel.$parsers.push(function (value) {

        var number = util
          .toFloat(value)
          .toFixed(2)

        if (ngModel.$validators.currency(number)) {

          var formatted = $filter('currency')(number)
          var specialCharacters = [',', CURRENCY_SYMBOL]

          // did we add a comma or currency symbol?
          var specialCharactersCountChange = [value, formatted]
            .map(function (string) {
              return util.occurrences(string, specialCharacters)
            })
            .reduce(function (prev, cur) {
              return cur - prev
            })

          // compute the new selection range, correcting for
          // formatting introduced by the currency $filter
          var selectonRange = [
            element[0].selectionStart,
            element[0].selectionEnd
          ].map(function (position) {
            return position + specialCharactersCountChange
          })

          // set the formatted value in the view
          ngModel.$setViewValue(formatted)
          ngModel.$render()

          // set the cursor back to its expected position
          // (since $render resets the cursor the the end)
          element[0].setSelectionRange(selectonRange[0], selectonRange[1])
        }

        return number

      })

      ngModel.$validators.currency = function (modelValue) {
        return !isNaN(modelValue)
      }

    }
  }

})