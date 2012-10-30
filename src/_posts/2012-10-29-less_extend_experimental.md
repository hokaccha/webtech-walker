---
layout: posts
title: lessのextendがexperimentalなブランチにマージされたようです
tags: 
  - less
  - CSS
---

一年くらい前に僕がpull requestしたSassのextendみたいな機能をlessにも実装するってやつが実験的なブランチにマージされたっぽい。

[Add Sass like extend by hokaccha · Pull Request #509 · cloudhead/less.js](https://github.com/cloudhead/less.js/pull/509)  
[cloudhead/less.js at 1\_4\_0](https://github.com/cloudhead/less.js/tree/1_4_0)

シンタックスが`+`は隣接セレクタと間違えそうだからってことで`++`になってる。

こんな感じのlessファイルをコンパイルすると

{% highlight css %}
.foo {
  color: red;
}

.bar {
  ++.foo;
  font-size: 13px;
}
{% endhighlight %}

結果はこうなる。

{% highlight css %}
.foo,
.bar {
  color: red;
}
.bar {
  font-size: 13px;
}
{% endhighlight %}

npmはgithubからモジュールをインストールできて`#`以降にブランチ名を指定すれば特定のブランチのものを取ってくるので次のようにすれば試すことができる。

    $ cd path/to/working_dir
    $ npm install git://github.com/cloudhead/less.js.git#1_4_0
    $ ./node_modules/.bin/lessc test.less
    .foo,
    .bar {
      color: red;
    }
    .bar {
      font-size: 13px;
    }

lessの作者のcloudheadさんがやる気なくしたのかなんなのか、まったくコミットしなくなってlessはもう終わりだみたいな感じに一時期なっていて、extendのやつも全く取り込まれる気配がなかったんだけど、最近では別の人が開発を引き継いで開発が進んでるようで、extendもそういう流れで取り込まれたみたい。

masterにいつマージされるか（そもそもマージされるかどうか）はまだ未定だけど早く使えるようになるといいな。

ちなみにそんな僕は最近Sass派。
