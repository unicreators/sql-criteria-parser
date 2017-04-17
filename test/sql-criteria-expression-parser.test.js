
const assert = require('assert');
const SqlCriteriaExpressionParser = require('../index');
const sqlCriteriaParser = new SqlCriteriaExpressionParser();

describe('sql_criteria-expression_parser.test.js', function () {

    it('default operator ($=)', function () {

        let e = { 'name': 'yichen' };

        let { segment, values } = sqlCriteriaParser.parse(e);
        assert(segment == 'name = ?');
        assert(Array.isArray(values));
        assert.deepEqual(values, ['yichen']);
    });

    it('default logical operator ($and)', function () {

        let e = { 'name': 'yichen', 'age': 22 };

        let { segment, values } = sqlCriteriaParser.parse(e);
        assert(segment == '(name = ?) AND (age = ?)');
        assert(Array.isArray(values));
        assert.deepEqual(values, ['yichen', 22]);
    });

    it('array value operator ($in)', function () {

        let e = { 'age': [22, 23, 24] };

        let { segment, values } = sqlCriteriaParser.parse(e);
        assert(segment == 'age IN (?)');
        assert(Array.isArray(values));
        assert.deepEqual(values, [[22, 23, 24]]);
    });

    it('comparison operators ($>, $>=, $<, $<=, $<>)', function () {

        let e = { 'age': { '$>': 1, '$>=': 2, '$<': 3, '$<=': 4, '$<>': 5 } };

        let { segment, values } = sqlCriteriaParser.parse(e);
        assert(segment == '(age > ?) AND (age >= ?) AND (age < ?) AND (age <= ?) AND (age <> ?)');
        assert(Array.isArray(values));
        assert.deepEqual(values, [1, 2, 3, 4, 5]);
    });

    it('comparison operators ($startsWith, $endsWith, $contains)', function () {

        let e = { 'name': { '$startsWith': 'a', '$endsWith': 'b', '$contains': 'c' } };

        let { segment, values } = sqlCriteriaParser.parse(e);
        assert(segment == '(name LIKE ?) AND (name LIKE ?) AND (name LIKE ?)');
        assert(Array.isArray(values));
        assert.deepEqual(values, ['a%', '%b', '%c%']);
    });

    it('comparison operators ($in)', function () {

        let e = { 'age': { '$in': [1, 2, 3] } };

        let { segment, values } = sqlCriteriaParser.parse(e);
        assert(segment == 'age IN (?)');
        assert(Array.isArray(values));
        assert.deepEqual(values, [[1, 2, 3]]);
    });

    it('logical operator ($and)', function () {

        let e = { '$and': { 'name': 'yichen', 'age': 22 } };

        let { segment, values } = sqlCriteriaParser.parse(e);
        assert(segment == '(name = ?) AND (age = ?)');
        assert(Array.isArray(values));
        assert.deepEqual(values, ['yichen', 22]);
    });


    it('logical operator ($or)', function () {

        let e = { '$or': { 'name': 'yichen', 'age': 22 } };

        let { segment, values } = sqlCriteriaParser.parse(e);
        assert(segment == '(name = ?) OR (age = ?)');
        assert(Array.isArray(values));
        assert.deepEqual(values, ['yichen', 22]);
    });

    it('logical operator (nest)', function () {

        let e = { 'age': { '$or': { '$>': 10, '$<': 22 } } };

        let { segment, values } = sqlCriteriaParser.parse(e);
        assert(segment == '(age > ?) OR (age < ?)');
        assert(Array.isArray(values));
        assert.deepEqual(values, [10, 22]);
    });

    it('parameter placeholder (@)', function () {

        let e = { 'name': 'yichen' };

        let { segment, values } = new SqlCriteriaExpressionParser('@').parse(e);
        assert(segment == 'name = @');
        assert(Array.isArray(values));
        assert.deepEqual(values, ['yichen']);
    });

    

    it('composite', function () {

        let e = {
            '$or': {
                '$or': {
                    'name': {
                        '$or': { '$=': 'yichen', '$endsWith': 'a' }
                    },
                    'age': { '$>': 10, '$<': 22 }
                },
                'gender': 1,
                'level': [1, 2, 3],
                'size': { '$in': [18, 19] }
            }
        };

        let { segment, values } = sqlCriteriaParser.parse(e);
        assert(segment == '(((name = ?) OR (name LIKE ?)) OR ((age > ?) AND (age < ?))) OR (gender = ?) OR (level IN (?)) OR (size IN (?))');
        assert(Array.isArray(values));
        assert.deepEqual(values, ['yichen', '%a', 10, 22, 1, [1, 2, 3], [18, 19]]);
    });




});