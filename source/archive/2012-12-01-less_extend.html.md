---
title: 最近のLessのextendの進捗
tags: CSS
---

今年も始まりましたAdvent Calendar。このエントリーは[CSS Preprocessor Advent Calendar 2012](http://www.adventar.org/calendars/1)の一日目です。

去年は[Less & Sass Advent calendar](http://atnd.org/events/21919)というのをやりましたが、今年はSassやLessだけじゃなく、Stylusなども含めてCSS Preprocessorというくくりにしてみました。まだ最後のほうに空きがあるので我こそはと思われる方はぜひ参加してみてください。

また、Advent Calendarとは関係ないですが、[CSS Preprocessor JP](https://groups.google.com/forum/?hl=ja&fromgroups#!forum/css-preprocessor-jp)というグループをつくったので興味がある人はぜひ参加してみてください。Sassのインストールの仕方がわからないとか、最近はどういうのが流行ってるかなど意見交換の場にしてもらえればと思っています。きっとAdvent Calendarの参加者の人たちあたりがビシッと教えてくれるはずです。

さて本題。去年のAdvent Calendarのときに[Lessにextendを実装してみた](http://d.hatena.ne.jp/hokaccha/20111214/1323821463)んですが、しばらくとりこまれる気配がなくて、最近になって開発がさかんになり、1\_4\_0ブランチに取り込まれました。

[cloudhead/less.js at 1\_4\_0](https://github.com/cloudhead/less.js/tree/1_4_0)

取り込まれてからも[シンタックスに関する議論](https://github.com/cloudhead/less.js/pull/509)が活発に続いており、紆余曲折ありましたが、今は以下の様なシンタックスに落ち着いたようです。（が、まだ変わる可能性はあります）

```css
.foo {
  color: red;
}

.bar {
  &:extend(.foo);
  font-size: 13px;
}
```

これをコンパイルすると次のようになります。

```css
.foo,
.bar {
  color: red;
}
.bar {
  font-size: 13px;
}
```

最初僕が実装したときは`+.foo`みたいなシンタックスだったんですが、隣接セレクタみたいでわかりにくいということで`++.foo`になって、それもやっぱ微妙だねということで`&:extend(.foo)`のようになったみたいです。

たしかにわかりやすいとは思うけどLessっぽくはないなあと思いつつ、Lessらしさが何なのか語れるほどLessを使ってないので議論には参加してません。

このくらいライトな記事でもいいのでぜひAdvent Calendarに参加してみてください！
