angular
.module('bcherny/formatAsCurrency', [])
.service('formatAsCurrencyUtilities', ['$locale', function ($locale) {

  // (currencyString: String) => Number
  // eg. "$123.00" => 123.00
  this.toFloat = function (currencyString) {

    if (!angular.isString(currencyString)) {
      throw new TypeError ('formatAsCurrencyUtilities#toFloat expects its 1st argument to be a String, but was given ' + currencyString)
    }

    var specialCharFinder = new RegExp('((' + $locale.NUMBER_FORMATS.CURRENCY_SYM.replace(/(.)/g, '\\$1') + ')|\\' + $locale.NUMBER_FORMATS.GROUP_SEP + ')+', 'g')
    return parseFloat(currencyString.replace(specialCharFinder, '').replace($locale.NUMBER_FORMATS.DECIMAL_SEP, '.'), 10)
  }

}])
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
        var number = util
          .toFloat(value)
          .toFixed(2)

        if (ngModel.$validators.currency(number)) {

          var formatted = filter(number)
          var dotIndex = value.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP)

          // gets the difference in the position of the decimal separator betwen the formatted number and the one on the input
          var charDifference = formatted.indexOf($locale.NUMBER_FORMATS.DECIMAL_SEP) - (dotIndex === -1 ? value.length : dotIndex)

          // compute the new selection range, correcting for
          // formatting introduced by the currency $filter
          var selectonRange = [
            element[0].selectionStart,
            element[0].selectionEnd
          ].map(function (position) {
            return position + charDifference
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