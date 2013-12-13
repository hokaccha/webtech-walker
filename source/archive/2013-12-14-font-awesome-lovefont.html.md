---
title: Font AwesomeマジAwesome &#x23;LOVEFONT
date: 2013-12-14 00:00 JST
tags: CSS
---

[#LOVEFONT Advent Calendar 2013](http://www.adventar.org/calendars/63) 14日目です。

フォントについて語るAdvent Calendarなんだけど斜め上でFont Awesomeについて書こうと思います。

Font AwesomeというのはWebサイトで使える様々なアイコンをフォントファイルとして提供しているライブラリです。

[Font Awesome](http://fontawesome.io/)

これの何がいいかというと、まず色々なアイコンが簡単に使えるというのはもちろんのこと、それがフォントファイルで提供されているというところです。フォントファイルで提供されているということはつまり、CSSで見た目を制御できるわけです。

例えば、大きさを変えようと思ったら`font-size`プロパティで変えられるし、色を変えようと思ったら`color`プロパティで変えられるわけ。つまりアイコンをちょっと変更するだけで画像切り出し直すみたいな手間から開放されるわけで、マジAwewomeなわけです。

使い方は簡単で、CSSとフォントファイルを読み込んだら`i`要素に決まった`class`を指定するだけ。

```html
<i class="fa fa-check"></i>
```

これだけ。（前は`class="icon-check"`とかだったけどバージョン4から`fa`に変わった）

あと、色とか大きさ変えるだけじゃなくて、CSSのアニメーションなんかも当然効くのでローディングのアニメーションなんかも簡単にできます。

例えばこんな感じ。

<iframe width="100%" height="280" src="http://jsfiddle.net/hokaccha/KZY6F/4/embedded/result,html,css/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

また、フォントファイルをローカルにインストールすればPhotoShopなんかでも使えるのでデザイナさんも楽にデザインできるみたいです（たぶん）。

以上、#LOVEFONT Advent Calendarとしては斜め上なエントリでした。
