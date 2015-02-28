describe ('format-as-currency', function () {

  var util

  beforeEach(function() {

    module('bcherny/formatAsCurrency')

    inject(function ($compile, $rootScope, formatAsCurrencyUtilities) {

      util = formatAsCurrencyUtilities

      this.parentScope = $rootScope.$new(true)
      this.parentScope.value = null
      this.element = '<input type="text" ng-model="value" format-as-currency>'

      $compile(this.element)(this.parentScope)

      this.scope = this.element.$$childHead

    })

  })

  describe ('formatAsCurrency', function () {

    it ('should format values as currencies', function () {

    })

    it ('should set the correct cursor position after formatting', function () {

    })

  })

  describe ('formatAsCurrencyUtilities', function () {

    describe ('#occurences', function () {

      it ('should throw a TypeError when its 1st argument is not a String', function () {

        [42, [], {}, function(){}].forEach(function (first) {

          expect(function(){
            util.occurences(first, [])
          }).toThrowError(TypeError)

        })

      })

      it ('should throw a TypeError when its 2nd argument is not an Array', function () {

        [42, 'foo', {}, function(){}].forEach(function (second) {

          expect(function(){
            util.occurences('foo', second)
          }).toThrowError(TypeError)

        })

      })

    })

    describe ('#toFloat', function () {

      it ('should throw a TypeError when its 1nd argument is not a String', function () {

        [42, [], {}, function(){}].forEach(function (first) {

          expect(function(){
            util.toFloat(first)
          }).toThrowError(TypeError)

        })

      })

      it ('should parse currency strings to floats', function () {

        [
          ['10', 10],
          ['10.00', 10],
          ['$10.00', 10],
          ['$12.34', 12.34],
          ['$123,456', 123456],
          ['$123,456,789.12', 123456789.12]
        ]
        .forEach(function (testCase) {

          expect(util.toFloat(testCase[0]))
            .toBe(testCase[1])

        })

      })

    })

  })


})