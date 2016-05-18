angular
  .module('test', [])
  .filter('foo', function () {
    return function (value) {
      return '*' + value + '*'
    }
  })

describe ('format-as-currency', function () {

  var element, scope, element2, scope2, util

  beforeEach(function() {

    module('test')
    module('bcherny/formatAsCurrency')

    inject(function ($compile, $rootScope, formatAsCurrencyUtilities) {

      util = formatAsCurrencyUtilities

      // vanilla
      scope = $rootScope.$new(true)
      scope.value = null
      element = angular.element('<input type="text" ng-model="value" format-as-currency>')
      angular
        .element(document.body)
        .append(element)
      $compile(element)(scope)
      scope.$digest()

      // custom filter
      scope2 = $rootScope.$new(true)
      scope2.value = 123.45
      element2 = angular.element('<input type="text" ng-model="value" format-as-currency currency-filter="\'foo\'">')
      angular
        .element(document.body)
        .append(element2)
      $compile(element2)(scope2)
      scope2.$digest()

    })

  })

  describe ('formatAsCurrency', function () {

    it ('should format model values as currencies', function () {

      [
        [0, '$0.00'],
        [123, '$123.00'],
        [123456, '$123,456.00'],
        ['foo', '']
      ]
      .forEach(function (testCase) {

        scope.$apply(function(){
          scope.value = testCase[0]
        })

        expect(element.val())
          .toBe(testCase[1])

      })

    })

    it ('should accept custom currency formatters', function(){

      [
        [0, '*0*'],
        [123, '*123*'],
        [123456, '*123456*'],
        ['foo', '*foo*']
      ]
      .forEach(function (testCase) {

        scope2.$apply(function(){
          scope2.value = testCase[0]
        })

        expect(element2.val())
          .toBe(testCase[1])

      })

    })

    it ('should run the custom currency formatter at initialization', function(){

      expect(element2.val())
        .toBe('*123.45*')

    })

    it ('should parse currencies from the view', function(){

      [
        ['0', (0).toFixed(2)],
        ['$0.00', (0).toFixed(2)],
        ['$0.999', (0.99).toFixed(2)],
        ['$123.00', (123).toFixed(2)],
        ['$123,456.78', '123456.78'],
        ['foo', void 0]
      ]
      .forEach(function (testCase) {

        element
          .val(testCase[0])
          .triggerHandler('change')

        expect(scope.value)
          .toBe(testCase[1])

      })

    })

    it ('should set the correct cursor position after formatting', function () {

      [
        ['0', [0,0], [1,1]],
        ['0', [1,1], [2,2]],
        ['0', [0,1], [1,2]],
        ['$0', [0,0], [0,0]],
        ['$0', [1,1], [1,1]],
        ['0.00', [1,1], [2,2]],
        ['123,456', [1,1], [2,2]],
        ['$123,456', [1,1], [1,1]],
        ['$123,456.00', [1,1], [1,1]]
      ]
      .forEach(function (testCase) {

        element.val(testCase[0])
        element[0].selectionStart = testCase[1][0]
        element[0].selectionEnd = testCase[1][1]
        element.triggerHandler('change')

        expect(element[0].selectionStart)
          .toBe(testCase[2][0])
        expect(element[0].selectionEnd)
          .toBe(testCase[2][1])

      })

    })

    it ('should respect localized currencies', inject(function ($locale) {

      $locale.NUMBER_FORMATS.CURRENCY_SYM = 'foo'

      scope.$apply(function(){
        scope.value = 123
      })

      expect(element.val())
        .toBe('foo123.00')

    }))

    it ('should mark the view as invalid when the view contains an invalid currency', function () {

      element
        .removeClass('ng-invalid')
        .removeClass('ng-invalid-currency')
        .val('foo')
        .triggerHandler('change')

      expect(element.hasClass('ng-invalid'))
        .toBe(true)

      expect(element.hasClass('ng-invalid-currency'))
        .toBe(true)

    })

    it ('should ignore special characters', function() {
      [
        ['$0.00', '0.00'],
        ['$abcdWXYZ123,456', '123456.00'],
        ['!@#$%^&*()_+$123,456', '123456.00'],
        ['={}[]\\/><:;$123,456.00', '123456.00']
      ]
      .forEach(function (testCase) {

        element
          .val(testCase[0])
          .triggerHandler('change')

        expect(scope.value)
          .toBe(testCase[1])

      })
    })

  })

  describe ('formatAsCurrencyUtilities', function () {

    describe ('#occurrences', function () {

      it ('should throw a TypeError when its 1st argument is not a String', function () {

        [42, [], {}, function(){}].forEach(function (first) {

          expect(function(){
            util.occurrences(first, [])
          }).toThrowError(TypeError)

        })

      })

      it ('should throw a TypeError when its 2nd argument is not an Array', function () {

        [42, 'foo', {}, function(){}].forEach(function (second) {

          expect(function(){
            util.occurrences('foo', second)
          }).toThrowError(TypeError)

        })

      })

      it ('should throw a TypeError when passed a non-String needle', function () {

        [42, [], {}, function(){}].forEach(function (needle) {

          expect(function(){
            util.occurrences('foo', [needle])
          }).toThrowError(TypeError)

        })

      })

      it ('should return the number of occurrences of the given substrings in the haystack', function () {

        [
          ['foo', [], 0],
          ['foo', ['b'], 0],
          ['foo', ['o'], 2],
          ['123,456,789,012', [','], 3],
          ['$123,456', ['$', ','], 2],
          ['..,,..,,', [',', '.'], 8],
          ['//\///\/', ['/'], 6],
          ['[][][]', [']'], 3]
        ]
        .forEach(function (testCase) {

          expect(util.occurrences(testCase[0], testCase[1]))
            .toBe(testCase[2])

        })

      })

    })

    describe ('#toFloat', function () {

      it ('should throw a TypeError when its 1st argument is not a String', function () {

        [42, [], {}, function(){}].forEach(function (first) {

          expect(function(){
            util.toFloat(first)
          }).toThrowError(TypeError)

        })

      })

      it ('should parse currency strings to floats', function () {

        [
          // +
          ['10', 10],
          ['10.00', 10],
          ['$10.00', 10],
          ['$12.34', 12.34],
          ['$123,456', 123456],
          ['$123,456,789.12', 123456789.12],

          // -
          ['foo', NaN],
          ['.', NaN]
        ]
        .forEach(function (testCase) {

          expect(util.toFloat(testCase[0]))
            .toEqual(testCase[1])

        })

      })

    })

    describe ('#uniq', function () {

      it ('should return the given array without duplicates', function () {

        [
          [[], []],
          [[1,2,3], [1,2,3]],
          [[1,2,3,3,1], [1,2,3]]
        ]
        .forEach(function (test) {
          expect(util.uniq(test[0])).toEqual(test[1])
        })

      })

    })

    describe ('#uniqueChars', function () {

      it ('should throw a TypeError when its 1st or 2nd argument is not a String', function () {

        [42, [], {}, function(){}].forEach(function (first) {

          expect(function(){
            util.uniqueChars(first, 'foo')
          }).toThrowError(TypeError)

        });

        [42, [], {}, function(){}].forEach(function (second) {

          expect(function(){
            util.uniqueChars('foo', second)
          }).toThrowError(TypeError)

        })

      })

      it ('should return unique characters', function () {

        [
          ['abc', 'abc', []],
          ['abc', 'abcd', ['d']],
          ['abcd', 'abc', []],
          ['123456.78', '$123,456.78', ['$', ',']],
          ['abcd', 'eee', ['e']]
        ]
        .forEach(function (test) {
          expect(util.uniqueChars(test[0], test[1])).toEqual(test[2])
        })

      })

    })

  })

})
