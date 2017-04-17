## SqlCriteriaParser

一个可以将 javascript 对象表达式转换为 T-SQL 条件语句的转换器。


```js
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


console.log(segment);
// (((name = ?) OR (name LIKE ?)) OR ((age > ?) AND (age < ?))) OR (gender = ?) OR (level IN (?)) OR (size IN (?))

console.log(values);
// ['yichen', '%a', 10, 22, 1, [1, 2, 3], [18, 19]]

```


## Install

```sh
$ npm install sql-criteria-parser
```


## Usage

```js
const SqlCriteriaParser = require('sql-criteria-parser');

let parser = new SqlCriteriaParser('?');

let e = { '$or': { 'name': 'yichen', 'age': 22 } };
let { segment, values } = parser.parse(e);

console.log(segment);
// '(name = ?) OR (age = ?)'

console.log(values);
// ['yichen', 22]

```

## Operator

- `$=` to `=`
- `$>` to `>`
- `$<` to `<`
- `$>=` to `>=`
- `$<=` to `<=`
- `$<>` to `<>`
- `$startsWith` to `LIKE`
- `$endsWith` to `LIKE`
- `$contains` to `LIKE`
- `$in` to `IN`
  
  
- `$and` to `AND`
- `$or` to `OR`




### License

[MIT](LICENSE)