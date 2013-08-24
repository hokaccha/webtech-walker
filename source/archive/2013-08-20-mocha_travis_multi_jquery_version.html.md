---
title: jQueryプラグインのテストを複数のjQueryのバージョンで実行する
tags:
  - JavaScript
  - test
---

Travis CIは

```yaml
language: node_js
node_js:
  - 0.10
  - 0.8
  - 0.6
```

とか書けば複数のバージョンでテスト実行してくれてマジすごいんだけど、同じことをjQueryのバージョンでもやってみた。

主にjQueryのプラグインを書いてる場合などに便利だと思う。1.9で非互換な変更があったんでバージョン違うとプラグイン動かないとかけっこうあるからね。

まず[mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs)を使ってmochaで書いたテストをphantomjsで動くようにする。

jQueryのバージョンはmocha-phantomjsに環境変数で渡したいんだけど、mocha-phantomjsは環境変数をブラウザに渡せるようになってなかったので、パッチ書いたのでひとまずそっちを使う。（Pull Requestは送っといたので取り込まれたらそっち使いましょう）

（追記：取り込まれた）

    $ npm install mocha-phantomjs

そしたらjQueryを環境変数からバージョンを切り替えて読めるようにする。こんな感じ。

```javascript
(function() {
  var v = '1.8.2'; // ブラウザでテストを走らせる場合のバージョン
  var mpjs = window.mochaPhantomJS;
  if (mpjs && mpjs.env.JQUERY_VERSION) {
     v = mpjs.env.JQUERY_VERSION;
  }
  var src = 'http://ajax.googleapis.com/ajax/libs/jquery/' + v + '/jquery.js';

  document.write('<script src="' + src + '"></script>');
  document.write('<script>console.log("Load jQuery: " + $.fn.jquery)</script>');
})();
```

これでjQueryを環境変数からバージョンを指定して読み込めるようになるので、次のようなコマンドで実行するとバージョンを変更できる。

    $ JQUERY_VERSION=1.9.1 ./node_modules/.bin/mocha-phantomjs test/index.html
    Load jQuery: 1.9.1

    # test result ...

Travis CI の設定はこんな感じ。

```yaml
language: node_js
node_js:
  - 0.8
script: npm test
env:
  - JQUERY_VERSION=1.6.4
  - JQUERY_VERSION=1.7.2
  - JQUERY_VERSION=1.8.3
  - JQUERY_VERSION=1.10.2
  - JQUERY_VERSION=2.0.2
```

Travis CIは環境変数が上記のように複数指定されてるとすべてのパターンでテストを実行してくれるのでこれで全部のバージョンでテストされる。

結果はこんな感じ。

[hokaccha/mocha-phantom-travis-test - Travis CI](https://travis-ci.org/hokaccha/mocha-phantom-travis-test/builds/10399660)

Travis CI 便利すぎる。
