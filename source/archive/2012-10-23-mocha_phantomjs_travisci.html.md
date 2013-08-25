---
title: mochaとphantomJSとtravis-ciでフロントエンドJavaScriptのテスト
date: 2010-10-23T00:00:01+09:00
tags: 
 - JavaScript
 - test
---

[東京Node学園祭2012 アドベントカレンダー](http://atnd.org/events/33022)の9日目です。Node.jsとほとんど関係ないうえに内容がけっこう薄い感じなった気がするんですけど気にせずいこうと思います。

フロントエンドのJavaScriptをテストするとき最近はいつもmochaを使ってるんですが、やはりJenkinsとかtravis-ciを使って自動テストもしたいと思って試してみました。

[hokaccha/mocha-phantom-travis-test](https://github.com/hokaccha/mocha-phantom-travis-test)

ここではよくあるjQueryで画像のロールオーバーをするというプラグインを作ってそのライブラリに対してテストを書いています。ソースコードはこんな感じです。

```javascript
$.fn.rollover = function() {
  return this.each(function() {
    var $img = $(this);
    var src = $img.attr('src');
    var src_on = src.replace(/_off\.(\w+)$/, '_on.$1');

    $img.bind('mouseenter', function() {
      $img.attr('src', src_on);
    });

    $img.bind('mouseleave',function() {
      $img.attr('src', src);
    });
  });
};
```

画像名に`_off`という文字列がある場合にマウスオーバーで`_on`に切り替えるといういたって普通のロールオーバーのプラグインです。こんな感じで動きます。

[rollover sample](http://hokaccha.github.com/mocha-phantom-travis-test/example/)

このプラグインに対してmochaでテストを書くとこのようになります。

```javascript
describe('jquery.rollover', function() {
  var $img;
  var off = '../example/menu01_off.png';
  var on = '../example/menu01_on.png';

  beforeEach(function() {
    $img = $('<img>').attr('src', off).rollover();
    expect($img.attr('src')).to.be(off);
  });

  it('mouseenterで_offが_onになること', function() {
    $img.trigger('mouseenter');
    expect($img.attr('src')).to.be(on);
  });

  it('mouseleaveで_onが_offになること', function() {
    $img.trigger('mouseenter');
    expect($img.attr('src')).to.be(on);

    $img.trigger('mouseleave');
    expect($img.attr('src')).to.be(off);
  });
});
```

ブラウザでテストを実行するとこんな感じになります。

[Test \| jquery.rollover](http://hokaccha.github.com/mocha-phantom-travis-test/test/)

このテストをphantomJSで実行できるようにします。mochaのテストをphantomJSで実行できるようにするのに[mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs)というのものがあります。mochaはreporterにspecやtapを指定してブラウザで実行した場合`console.log`で出力するのでphantomJSの`onConsoleMessage`とか使えば簡単に書けそうだったので自分で書いてみようと思ったんですけど予想以上に面倒なことが多かったのでおとなしくこのライブラリをつかうことにしました。

mocha-phantomjsをnpmでインストールするようにしてもいいんですが、フロントエンドのコードしかないプロジェクトにnodeとかnpmの依存が入るのはどうかと思ったので必要なファイルだけもってきて設置しました。必要なのは以下の2ファイルです。

* [lib/mocha-phantomjs.coffee](https://github.com/metaskills/mocha-phantomjs/blob/master/lib/mocha-phantomjs.coffee)
* [lib/mocha-phantomjs/core_extensions.js](https://github.com/metaskills/mocha-phantomjs/blob/master/lib/mocha-phantomjs/core_extensions.js)

どこに置いてもいいんですが、今回の例ではtest/libディレクトリに設置しています。

[mocha-phantom-travis-test/test/lib](https://github.com/hokaccha/mocha-phantom-travis-test/tree/master/test/lib)

そして`mocha.run()`を実行するところを次のように書きます。

```javascript
window.onload = function() {
  if (window.mochaPhantomJS) {
    mochaPhantomJS.run();
  } else {
    mocha.run();
  }
};
```

phantomJSから呼ぶ場合は`mochaPhantomJS.run()`で実行、そうでない場合は通常の`mocha.run()`でテストを実行するようにしています。

これで以下のようにするとmochaのテストをコマンドラインから実行できます。

    $ phantomjs test/lib/mocha-phantomjs.coffee test/index.html

      jquery.rollover
        ✓ mouseenterで_offが_onになること 
        ✓ mouseleaveで_onが_offになること 


      ✔ 2 tests complete (21 ms)

ファイル名の後にreporterを指定することもできるので結果を`tap`で出力することもできます。デフォルトは`spec`です。

最後にtravis-ciの設定ですが、travis-ciはphantomJSをサポートしているので、.travis.ymlにその設定を以下のように書くだけです。

    script: phantomjs test/lib/mocha-phantomjs.coffee test/index.html

これでtravis-ciのほうでこのリポジトリを追加してpushしたら自動でテストが走るようになります。簡単すぎワロタ。

以下が結果です。

[hokaccha/mocha-phantom-travis-test #1 \| Travis CI](https://travis-ci.org/#!/hokaccha/mocha-phantom-travis-test/builds/2862206)

以下はわざとコケるようにしてみたテストの結果です。

[hokaccha/mocha-phantom-travis-test #2 \| Travis CI](https://travis-ci.org/#!/hokaccha/mocha-phantom-travis-test/builds/2862214)

このようにtravis-ciを使うと簡単に自動テストできますが、phantomJSでテストできるところまでいけばあとはJenkinsでも同じようにできるはずです。

便利な世の中になったものだと思いました。
