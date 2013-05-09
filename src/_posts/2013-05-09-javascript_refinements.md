---
layout: posts
title: JavaScriptでRuby 2.0のRefinements的なのを実装してみる
tags:
  - JavaScript
  - Ruby
---

Ruby2.0でRefinementsという、クラスの拡張を特定にスコープに限定する仕組みが導入された（一応使えるけどまだ実験的な機能）。

こんな感じで使う

{% highlight ruby %}
# foo.rb
module Foo
  refine String do
    def greeting
      "hello #{self}!"
    end
  end
end
{% endhighlight %}

{% highlight ruby %}
require './foo'
using Foo

puts 'hokaccha'.greeting #=> hello hokaccha!
{% endhighlight %}

`refine`で拡張した`String#greeting`メソッドは`using`したファイル内でしか使えない。

このような仕組みがあると、どこでどのようにクラスが拡張されたか、わけがわからなくなるという問題を解決できる。

試しにJavaScriptでも実装してみた。

[refinements.js](https://gist.github.com/hokaccha/5546064)

こんな感じで使う。

{% highlight javascript %}
// TestRefineという名前でクラスの拡張を定義
Refinements.register('TestRefine', function(refine) {
  // String.prototypeを拡張する
  refine(String.prototype, {
    greeting: function() {
      return 'Hello ' + this + '!';
    }
  });
});

// registerした定義をusingで使う
Refinements.using('TestRefine', function() {
  // この中でのみ String#greeting が利用可能
  'hokkacha'.greeting(); //=> hello hokaccha!
});

'hokkacha'.greeting(); //=> エラー
{% endhighlight %}

`Refinements.using`のコールバックの中でだけ`refine`で定義したクラスの拡張が利用できる。

`register`の中ではいくつでも`refine`できる。

{% highlight javascript %}
Refinements.register('TestRefine', function(refine) {
  // Array.prototypeを拡張する
  refine(Array.prototype, {
    // ランダムで一個だけ要素を取得するメソッド
    sample: function() {
      var index = Math.floor(Math.random() * this.length);

      return this[index];
    }
  });

  // String.prototypeを拡張する
  refine(String.prototype, {
    greeting: function() {
      return 'Hello ' + this + '!';
    }
  });
});
{% endhighlight %}

また、`using`は複数のモジュールを一度に利用できる。

{% highlight javascript %}
Refinements.using('TestRefine', 'TestRefine2', function() {
  // ...
});
{% endhighlight %}

これで基本的によくないとされているネイティブオブジェクトのprototype拡張も比較的安全に行うことができるようになる。

ただし（致命的な）欠点に`using`の中で非同期処理があった場合、非同期処理の中では拡張が使えないというのがある。

{% highlight javascript %}
Refinements.using('TestRefine', function() {
  // ここでは使えるけど
  var elem = [1, 2, 3].sample();

  setTimeout(function() {
    // ここでは使えない
    var elem = [1, 2, 3].sample();
  }, 100);
});
{% endhighlight %}

`done`みたいな関数を引数にとって終了を待ってもいいけどそしたら`using`の外でも拡張が有効になる場合がでてきてRefinementsとはなんだったのかということになるので非同期の場合は諦めた。

つまり非同期処理が多用されるJavaScriptにおいてこのモジュールは使いものにならんということですね。
