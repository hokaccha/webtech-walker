---
layout: posts
title: jQueryの非推奨な機能
tags:
  - JavaScript
  - jQuery
---

[軽めのjQuery Advent Calendar 2012](http://www.adventar.org/calendars/29) 3日目の記事です。jQueryのDeprecated（非推奨）な機能をいくつか紹介します。

## $.browser

これは有名ですね。ブラウザで分岐するんじゃなくて機能があるかないかで分岐するのがいいから$.supportを使えよって話です。

まあIE6だけで起きるバグとかのためにブラウザ判定するのはありだと思いまけどjQuery的には$.browserは非推奨らしいです。

## .live()

`.live()`は非推奨で`.on()`とか`.delegate()`で同じ事でできるのでこっちを使うのを推奨してるみたいです。

## .size()

`.size()`はjQueryオブジェクトの要素数を返すメソッドですが、これが非推奨な理由は`.size()`と`.length`は同じで`.size()`のほうが関数呼び出しのオーバーヘッドがかかるから`.length`のほうがいいよってことらしいです。

## :checkbox、:radio、:submitなどのセレクタ

checkboxの要素を探したりするのに

{% highlight javascript %}
$(':checkbox');
{% endhighlight %}

とかいうjQueryの独自セレクタが使えるわけですが、これも実は非推奨です。

なぜかというと、次のように書いても同じで、

{% highlight javascript %}
$('[type=checkbox]')
{% endhighlight %}

`:checkbox`は独自セレクタなのに対して`[type=checkbox]`は`querySelector`などでパースできるためこっちのほうが早いからです。

`:button`、`:file`、`:image`なども同じ理由で非推奨です。

## その他の非推奨な機能

Deprecatedな機能は他にもいっぱいあって、一覧は以下に全部のってます。

[Deprecated – jQuery API](http://api.jquery.com/category/deprecated/)

軽めなんでドキュメント見ればすぐわかる内容のエントリでした。
