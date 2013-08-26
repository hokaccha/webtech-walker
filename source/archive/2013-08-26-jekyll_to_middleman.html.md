---
title: ブログをJekyllからmiddlemanに移行してTravis CIでデプロイするようにした
tags:
  - middleman
  - jekyll
  - blog
---

ちょうど一年くらい前にWordPressからJekyllに移行したんだけど、今回[middleman](http://middlemanapp.com/)で作りなおしてみた。特にJekyllに不満があったわけでもなく単に技術的興味によるもの。

## middleman

[Middleman: Hand-crafted frontend development](http://middlemanapp.com/)

middlemanはほぼJekyllのようなものなんだけど、[Asset Pipeline](http://middlemanapp.com/asset-pipeline/)が使えたり、[テンプレート](http://middlemanapp.com/templates/)がerbとかhaml、Slimなどで書けたり、[helper](http://middlemanapp.com/helpers/)が充実してたりする。

RailsのViewまわりの機能をそのまま持ってきたような感じなので、普段Rails使ってる人にとってはJekyllよりも使いやすいかもしれない。個人的にもJekyllよりはmiddlemanのほうが好みだった。

調べた時にでてくる情報量などはJekyllのほうが多いかなという印象だったけど、このへんはもう少し時間が経てば解決するかなと思う。

せっかくAsset PipelineがあるんでAltJSとか使ってかっこいいJavaScriptにしちゃおうかなーと思ってたんだけどよく考えたらこのブログ一行もJSなくてAsset Pipelineがほぼ不発（Sassでちょっと使ってるくらい）に終わったのが残念だった。

## Travis CI でデプロイ

あと今回、gitでソースをmasterにpushしたらTravis CIがビルドしてビルド結果をgithub pagesにデプロイしてくれるという仕組みにしてみた。masterにpushするとこんな感じでビルドが走る。

[hokaccha/webtech-walker - Travis CI](https://travis-ci.org/hokaccha/webtech-walker/builds/10608485)

Jekyllのときはビルドしてデプロイするrakeのタスクを書いて手元でやってたんだけど（プラグイン使ってたのでgithub pages側でビルドできなかったので）、こういうのをCIサーバーにやってもらうのはやはり楽。

ちなみにこれはtricknotes先生の手法の丸パクリで、`Rakefile`とか`.travis.yml`もほぼそのまま使わせていただきました。詳しくは以下を参考のこと。

[Middleman で作った web サイトを Travis + GitHub pages でお手軽に運用する - tricknotesのぼうけんのしょ](http://tricknotes.hateblo.jp/entry/2013/06/17/020229)

トークンの設定とかがちょっとだけ面倒ではあるけどかなり簡単に設定でた。tricknotes++であります。

手元でビルドしたのとTravis CIでビルドしたのの結果が違うところがけっこうあって、デプロイするときに無駄なdiffがでてたので、それを解決するのにちょっと手間取った。

例えばtag一覧を出すときに、tagのデータをHashで持ってるので順番が保証されずにビルドの環境によって順番が変わるとかそういう感じ。他にもいくつかそういうのがあった。middleman-blogのバグっぽいのが原因のもいくつかあったのでそれについてはパッチ投げようかなと思ってる。
