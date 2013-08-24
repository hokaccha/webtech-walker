---
title: Backbone.Modelのattributesにオブジェクト入れるときの注意
tags: 
  - JavaScript
  - Backbone.js
---

[Backbone.js Advent Calendar](http://www.adventar.org/calendars/15)の15日目です。軽めにいきます。

Backbone.Modelの`attributes`にオブジェクトを設定するときの注意点など。`attributes`は`set`とかで設定される値をオブジェクトして持っているやつです。

まず次のように`set`で`attributes`を設定します。

```javascript
var MyModel = Backbone.Model.extend();

var m = new MyModel();
m.set('hoge', 'fuga');
m.set('foo', { bar: 'baz' });
```

このように`hoge`には文字列、`foo`にはオブジェクトを設定しました。そして`toJSON`で`attributes`を取得して値を更新してみます。

```javascript
var attrs = m.toJSON();
attrs.hoge = 'new fuga';
attrs.foo.bar = 'new baz';
```

そして`attributes`の中身を見てみると・・

```javascript
console.log(m.attributes);
// => { hoge: 'fuga', foo: { bar: 'new baz' } }
```

`hoge`の値は変わってないのに`foo.bar`の値が変わってますね。どうしてこうなった。

と、まあこういう問題があるわけです。

では原因を見て行きましょう。まず、`toJSON`の実装は次のようになっています。

```javascript
toJSON: function(options) {
  return _.clone(this.attributes);
},
```

このように`attributes`を`_.clone`してるだけです。`_.clone`してるということは参照ではなくてオブジェクトのコピーが返りそうな雰囲気です。コピーが返るということは返ってきた値を変更しても元のオブジェクトには影響しないはず・・。

なんですが、実は`_.close`はネストしたオブジェクトに対応しておらず、ネストしている場合はそのまま参照がコピーされるのです。なんてこったい＼(^o^)／

なので`hoge`の値は変更しても元の値は影響を受けておらず、`foo.bar`の値を変更したら元のオブジェクトにも影響がでてしまったというわけ。

ちなみに`_.close`の実装は次のようになってて

```javascript
_.clone = function(obj) {
  if (!_.isObject(obj)) return obj;
  return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
};
```

`_.extend({}, obj)`を返してるだけなので元凶は`_.extend`だったりします。`_.extend`は次のようにネストしたオブジェクトに対応してないのがわかります。

```javascript
var a = {
  foo: { bar: 'baz' }
};

var b = {
  foo: { hoge: 'fuga' }
};

_.extend(a, b); // { foo: { hoge: 'fuga' } }
```

この問題を解決できるのは我らがjQuery大先生です。jQueryの`$.extend`は第一引数を`true`にすることでネストしたオブジェクトにも対応できます。

```javascript
var a = {
  foo: { bar: 'baz' }
};

var b = {
  foo: { hoge: 'fuga' }
};

$.extend(true, a, b); // { foo: { bar: 'baz', hoge: 'fuga' } }
```

すばらしいですね。これを利用して次のように`toJSON`を上書きします。

```javascript
var MyModel = Backbone.Model.extend({
  toJSON: function(options) {
    return $.extend(true, {}, this.attributes);
  }
});
```

これで大丈夫なはず。

```javascript
var m = new MyModel();
m.set('hoge', 'fuga');
m.set('foo', { bar: 'baz' });

var attrs = m.toJSON();
attrs.hoge = 'new fuga';
attrs.foo.bar = 'new baz';

console.log(m.attributes);
// => { hoge: 'fuga', foo: { bar: 'baz' } }
```

おっけーですねー。すばらしいですねー。jQueryまじイノベーティブです。

以上、<del>jQuery</del><ins>Backbone.js</ins> Advent Calendarでした。
