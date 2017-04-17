//////////////////////////////
///  yichen

const ExpressionParser = require('object-expression-parser');

const _binary = function (operator, placehoader = '?', valueConvert = undefined) {
    return function (prop, value, originalOperator) {
        return {
            segment: `${prop} ${operator} ${placehoader}`,
            values: [valueConvert ? valueConvert(originalOperator, value) : value]
        };
    };
},
    _concat = function (operator, segments, level) {
        if (segments.length == 1) return segments[0];
        return `(${segments.join(`) ${operator} (`)})`;
    }, _convert_value = function (operator, value) {
        switch (operator.toLowerCase()) {
            case '$startswith':
            case '$endswith':
            case '$contains':
                {
                    if (typeof value !== 'string')
                        throw new Error(`'${operator}' value must be of string type.`);
                    switch (operator.toLowerCase()) {
                        case '$startswith': return `${value}%`;
                        case '$endswith': return `%${value}`;
                        case '$contains': return `%${value}%`;
                    }
                }
            default:
                return value;
        }
    };

module.exports = class SqlCriteriaExpressionParser extends ExpressionParser {
    constructor(parameterPlaceholder = '?') {
        super({
            '$>': _binary('>', parameterPlaceholder),
            '$>=': _binary('>=', parameterPlaceholder),
            '$<': _binary('<', parameterPlaceholder),
            '$<=': _binary('<=', parameterPlaceholder),
            '$<>': _binary('<>', parameterPlaceholder),
            '$startsWith': _binary('LIKE', parameterPlaceholder, _convert_value),
            '$endsWith': _binary('LIKE', parameterPlaceholder, _convert_value),
            '$contains': _binary('LIKE', parameterPlaceholder, _convert_value),
            '$in': _binary('IN', `(${parameterPlaceholder})`),
            '$=': _binary('=', parameterPlaceholder)
        },
            {
                '$and': function (segments, originalOperator, level) { return _concat('AND', segments, level); },
                '$or': function (segments, originalOperator, level) { return _concat('OR', segments, level); }
            },
            '$=',   // 当未指明比较操作符时使用 $=
            '$and', // 当未指明逻辑操作符时使用 $and
            '$in'   // 当值为数组时使用 $in
        );
    }
}
