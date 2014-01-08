---
title: クライアントサイドJavaScriptのテストカバレッジをCoverallsに投げる
date: 2014-01-08 13:42 JST
tags:
  - test
  - JavaScript
---

[Coveralls](https://coveralls.io/)というGitHubのプロジェクトのテストカバレッジを記録するためのサービスがあって、クライアントサイドのJavaScriptのテストでもできそうだったんでやってみた。

最近のJavaScriptのカバレッジツールは[Blanket.js](http://blanketjs.org/)がいけてるらしいんだけど、これを使ってクライアントサイドJavaScriptのカバレッジをCoverallsに投げるの若干めんどそうだったんで、[poncho](https://github.com/deepsweet/poncho)っていうラッパーを使ってみた。

ponchoはMocha、PhantomJS、Blanket.jsをうまいことつないでくれるやつで、普通にMochaでテスト書いてるプロジェクトだったらすごく簡単に設定できる。Mocha限定になっちゃうけど。

すでにMochaでテストが書かれてて、`test/index.html`とかでテスト実行できる（ブラウザで開いてMochaのテストが走る）とすると、まず、

```
$ npm install poncho
```

して、カバレッジをとりたい対象のファイルを読み込んでいる`script`要素に`data-cover`をつける。

```html
<script src="flipsnap.js" data-cover></script>
```

そして`poncho`コマンドを実行するとカバレッジが取れる（phantomjsがインストールされてないとダメかも）。こんな感じ。

```
$ ./node_modules/.bin/poncho test/index.html
file: flipsnap.js
coverage: 81.0909090909091
hist: 223
misses: 52
sloc: 275
```

これをCoverallsに投げるには、レポーターに`lcov`を指定して[node-coveralls](https://github.com/cainus/node-coveralls)にパイプで出力を渡すだけ。

```
$ npm install coveralls
$ ./node_modules/.bin/poncho -R lcov test/index.html | ./node_modules/.bin/coveralls
```

ローカルでこれ実行してもエラーになるので、これをtravis-ciで実行できるようにする。

例えば`.travis.yml`はこんな感じ。

```
script: phantomjs test/lib/mocha-phantomjs.coffee test/index.html
after_success:
  - npm install poncho coveralls
  - ./node_modules/.bin/poncho -R lcov test/index.html | ./node_modules/.bin/coveralls
```

npmのインストールとかは`package.json`に書いてもいいけどそのへんはお好みで。

そしてCoverallsとTravisCIの両方でプロジェクトをONにしてpushするとTravisCIからCoverallsに結果が送られる。結果はこんな感じ。

[pxgrid/js-flipsnap | Coveralls - Test Coverage History & Statistics](https://coveralls.io/r/pxgrid/js-flipsnap)

既存のコードにほとんど手を入れず（`data-cover`つけるぐらいで）簡単に設定できた。すごい。Mochaですでにテスト書いてある場合はponchoでCoverallsは簡単でオススメ。
