---
title: GraphQLでカスタムスカラー型を作る
date: 2016-02-15 22:05 JST
tags:
  - GraphQL
---

GraphQLの仕様というより[graphql-js](https://github.com/graphql/graphql-js)の実装の話。

GraphQLのビルトインのスカラー型はID、String、Int、Float、Booleanの5つだが、自分でスカラー型を作ることもできる。例えば日次を表すDateTime型とか。こんな感じ。

```javascript
// schema.js
import {
  GraphQLScalarType,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import { Kind } from 'graphql/language';

let parseDate = (str) => {
  let d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
};

let DateTimeType = new GraphQLScalarType({
  name: 'DateTime',

  serialize: value => {
    return value.toJSON();
  },
  parseValue: value => {
    return parseDate(value);
  },
  parseLiteral: ast => {
    return ast.kind === Kind.STRING ? parseDate(ast.value) : null;
  },
});
```

DateTime型みたいなのは、文字列で渡ってきた日付のデータをパースしてアプリケーション内部では`Date`として扱い、レスポンスのJSONにするときに`Date`を文字列に変換して返したい。`GraphQLScalarType`の引数に設定している関数はそのための変換処理を行うもの。

`parseValue`、`parseLiteral`がリクエストのクエリからデータを受け取ってアプリケーション内部で利用するデータに変換し、`serialize`はレスポンスを返す前に適切なデータに変換するための関数を定義する。

このDateTime型を使って次のようなスキーマを定義する。

```javascript
let ExampleType = new GraphQLObjectType({
  name: 'Example',
  fields: { created: { type: DateTimeType } },
});

let QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    example: {
      type: ExampleType,
      args: { date: { type: DateTimeType } },
      resolve: (_, args) => {
        // Dateで渡ってくる
        assert(args.date instanceof Date);

        // Dateとして何か処理して

        // Dateで返す
        return { created: args.date };
      },
    }
  }
});

let schema = new GraphQLSchema({ query: QueryType });
```

入力データとして`date`を受け取って、`created`というフィールドで値をそのまま返すだけ。`date`と`created`はどっちもDateType型。このスキーマに対してこういうクエリを投げる。

```
{
  example(date: "2015-01-01T00:00:00Z") { created }
}
```

この場合はアプリケーションに値が渡される前に`parseLiteral`に`"2015-01-01T00:00:00Z"`という値が渡されて呼ばれる。また、このとき値だけでなく、GraphQLのASTデータが渡されて、クエリに指定されているデータ型なども一緒にチェックできる。

```javascript
  parseLiteral: ast => {
    // ast.value === "2015-01-01T00:00:00Z"
    return ast.kind === Kind.STRING ? parseDate(ast.value) : null;
  },
```

ここで`null`を返すと不正な値ということでエラーになる。もしくはエラーにするのに`GraphQLError`のインスタンスを返してもいいみたいだけど内部のScalar型の定義が`null`を返しているのでそれに従っている。

[graphql-js/scalars.js at 9234c6da0edbc4d2d2f3ff5d544a5980168d69ac · graphql/graphql-js](https://github.com/graphql/graphql-js/blob/9234c6da0edbc4d2d2f3ff5d544a5980168d69ac/src/type/scalars.js#L102-L106)

`parseLiteral`はこのようにクエリ内に直接DateTime型の値が埋め込まれたときに呼ばれるのに対して、variablesでDateTime型の値が指定された場合に呼ばれるのが`parseValue`。例えばこういうクエリ。

```
query foo($d: DateTime) {
  example(date: $d) { created }
}
```

このクエリのvariablesがこういう感じだとする。

```json
{ "d": "2015-01-01T00:00:00Z" }
```

variablesで渡された値はASTを検査する必要はないので`parseValue`には値のみが渡ってくる。

```javascript
  parseValue: value => {
    // value === "2015-01-01T00:00:00Z"
    return parseDate(value);
  },
```

`parseValue`や`parseLiteral`で返した値は`resolve`の引数に渡される。ここ。

```javascript
      resolve: (_, args) => {
        // Dateで渡ってくる
        assert(args.date instanceof Date);

        // Dateとして何か処理して

        // Dateで返す
        return { created: args.date };
      },
```

そしてこの`resolve`でDateTime型のデータを返した場合はそのデータが`serialize`に渡される。

```javascript
  serialize: value => {
    return value.toJSON();
  },
```

この`serialize`で返した値がレスポンスとして返される。

```javascript
let query = `
query foo($d: DateTime) {
  example(date: $d) { created }
}
`;
let variables = { d: "2015-01-01T00:00:00Z" };

graphql(schema, query, null, variables).then(result => {
  console.log(result);
  //=> { data: { example: { created: '2015-01-01T00:00:00.000Z' } } }
});
```

input/ouputともに文字列だけどアプリケーション内部（`resolve`内）ではDateで処理できるのがわかる。

コード全文はこちらに。

[https://github.com/hokaccha/graphql-examples/tree/master/examples/date_time_type](https://github.com/hokaccha/graphql-examples/tree/master/examples/date_time_type)
