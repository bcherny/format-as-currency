angular
.module('bcherny/formatAsCurrency', [])
.service('formatAsCurrencyUtilities', function () {

  // (haystack: String, needles: Array<String>) => Number
  // eg. ('foo', 'o') => 2
  this.occurrences = function (haystack, needles) {

    if (!angular.isString(haystack)) {
      throw new TypeError ('formatAsCurrencyUtilities#occurrences expects its 1st argument to be a String, but was given ' + haystack)
    }

    if (!angular.isArray(needles)) {
      throw new TypeError ('formatAsCurrencyUtilities#occurrences expects its 2nd argument to be an Array, but was given ' + needles)
    }

    needles.forEach(function (needle, n) {
      if (!angular.isString(needle)) {
        throw new TypeError ('formatAsCurrencyUtilities#occurrences expects needles to be Strings, but needle #' + n + ' is ' + needle)
      }
    })

    return needles

      // get counts
      .map(function (needle) {
        var _needle = needle
          .replace(/\[/g, '\\[')
          .replace(/\]/g, '\\]')
        return (
          haystack.match(new RegExp('[' + _needle + ']', 'g')) || []
        ).length
      })

      // sum counts
      .reduce(function (prev, cur) {
        return prev + cur
      }, 0)
  }

  // (currencyString: String) => Number
  // eg. "$123.00" => 123.00
  this.toFloat = function (currencyString) {

    if (!angular.isString(currencyString)) {
      throw new TypeError ('formatAsCurrencyUtilities#toFloat expects its 1st argument to be a String, but was given ' + currencyString)
    }

    return parseFloat(currencyString.replace(/(\$|\,)+/g, ''), 10)
  }

  // (array: Array) => Array
  // eg. [1,2,2] => [1,2]
  this.uniq = function (array) {
    return array.reduce(function (prev, cur) {
      return prev.indexOf(cur) > -1 ? prev : prev.concat(cur)
    }, [])
  }

  // (a: String, b: String) => Array<String>
  // eg. 123.00, "$123.00" => ["$", ","]
  this.uniqueChars = function (a, b) {

    if (!angular.isString(a)) {
      throw new TypeError ('formatAsCurrencyUtilities#uniqueChars expects its 1st argument to be a String, but was given ' + a)
    }

    if (!angular.isString(b)) {
      throw new TypeError ('formatAsCurrencyUtilities#uniqueChars expects its 2nd argument to be a String, but was given ' + b)
    }

    var chars = a.split('')
    return this.uniq(
      b.split('').sort().reduce(function (prev, cur) {
        return chars.indexOf(cur) < 0 ? prev.concat(cur) : prev
      }, [])
    )

  }

})
.directive('formatAsCurrency', ['$filter', '$locale', 'formatAsCurrencyUtilities', function ($filter, $locale, formatAsCurrencyUtilities) {

  var util = formatAsCurrencyUtilities

  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attrs, ngModel) {

      var filter = $filter('currency')

      scope.$watch(function(){
        return scope.$eval(attrs.currencyFilter)
      }, function (f) {
        filter = f ? $filter(f) : $filter('currency')
      })

      ngModel.$formatters.push(function (value) {
        return filter(value)
      })

      ngModel.$parsers.push(function (value) {
        // ignore non-numeric characters
        value = value.replace(/[a-zA-Z!\?>:;\|<@#%\^&\*\)\(\+\/\\={}\[\]_]/g, '')
        
        var number = util
          .toFloat(value)
          .toFixed(2)

        if (ngModel.$validators.currency(number)) {

          var formatted = filter(number)
          var specialCharacters = util.uniqueChars(number, formatted)

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

}])