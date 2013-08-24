---
title: Node.jsのFiberを使って非同期処理を同期っぽく書く
tags: 
  - JavaScript
  - Node.js
---

FirefoxのJavaScriptではバージョンを1.7以上に指定するとyieldが使えて非同期処理を同期っぽく書くことができるようになる。

適当な例だけどこんな感じ。

```javascript
function run(f) {
  var g = f(function(x) { g.send(x) });
  g.next();
}
 
run(function(next) {
  var result = [];

  result.push('foo');

  // ここで1秒待つ
  yield setTimeout(function() {
    result.push('bar');
    next();
  }, 1000);

  // ここで1秒待つ
  var baz = yield setTimeout(function() {
    // nextの引数がyieldの返り値になる
    next('baz');
  }, 1000);

  result.push(baz);

  // 2秒後に出力
  console.log(result); // ["foo", "bar", "baz"]
});
```

ちなみにこのような手法は昔から知られているので詳しくは以下を参照のこと。

* [Kazuho@Cybozu Labs: JavaScript/1.7 で協調的マルチスレッド](http://labs.cybozu.co.jp/blog/kazuho/archives/2007/05/coopthread.php)
* [JavaScript1.7 の yield を使って、非同期処理を同期処理のように書く方法 - IT戦記](http://d.hatena.ne.jp/amachang/20080303/1204544340)

このようにyieldが使えるようになると夢広がりんぐなわけですが、未だにFirefox以外では利用できないわけです。そこでNode.jsの[node-fibers](https://github.com/laverdet/node-fibers)というネイティブ拡張を使うとyieldっぽいのができるようになる。

さっきのをnode-fibersを使って書くとこんな感じになる。だいたい同じ。

```javascript
var Fiber = require('fibers');

function run(f) {
  var fiber = Fiber(function() {
    f(function(x) { fiber.run(x) });
  });
  fiber.run();
}
 
run(function(next) {
  var result = [];

  result.push('foo');

  // ここで1秒待つ
  Fiber.yield(setTimeout(function() {
    result.push('bar');
    next();
  }, 1000));

  // ここで1秒待つ
  var baz = Fiber.yield(setTimeout(function() {
    // nextの引数がyieldの返り値になる
    next('baz');
  }, 1000));

  result.push(baz);

  // 2秒後に出力
  console.log(result); // ["foo", "bar", "baz"]
});
```

このままだとちょっと使いづらいので色々ラッパーがでてる。有名なのはこんなの。

* [synchronize](https://github.com/alexeypetrushin/synchronize)
* [asyncblock](https://github.com/scriby/asyncblock)

ちょっと試しに自分でも作ってみた。

[hokaccha/node-await-flow GitHub](https://github.com/hokaccha/node-await-flow)

こんな感じで使う。

```javascript
var AwaitFlow = require('await-flow');

// AwaitFlow.runのコールバックはawait関数を引数にとる
AwaitFlow.run(function(await) {
  // await関数を実行するとnextが実行されるまで次の処理に移るのを待つ
  var result = await(function(next) {
    setTimeout(function() {
      // next関数は第一引数にエラー、第二引数にawaitが返す値を指定する
      next(null, 'foo');
    }, 1000);
  });

  console.log(result); //=> foo
}, function(err) {
  // 処理が全部終わったら呼ばれる。エラーはまとめてここで処理できる
});
```

ファイルを読み込んで1秒まって別のファイルに書き込むみたいのはこんな感じで書ける。

```javascript
var AwaitFlow = require('await-flow');
var fs = require('fs');

AwaitFlow.run(function(await) {
  // read file async
  var content = await(function(next) {
    fs.readFile('./foo.txt', 'utf8', next);
  });

  // wait 1000ms
  await(function(next) {
    setTimeout(next, 1000);
  });

  // write file async
  await(function(next) {
    fs.writeFile('./bar.txt', content, next);
  });
}, function(err) {
  console.log(err);
});
```

Function#bindとか使えば1行でも書けるね！でも見づらいね！

```javascript
var AwaitFlow = require('await-flow');
var fs = require('fs');

AwaitFlow.run(function(await) {
  var content = await(fs.readFile.bind(fs, './foo.txt', 'utf8'));
  await(function(next) { setTimeout(next, 1000); });
  await(fs.writeFile.bind(fs, './bar.txt', content));
}, function(err) {
  console.log(err);
});
```

エラー処理とかがまだいまいちな感じで機能もsynchronizeとかasyncblockとかに比べて全然なのでnpmには上げてない。とりあえずコルーチン使った非同期処理を自分で書いてみたかっただけ。
