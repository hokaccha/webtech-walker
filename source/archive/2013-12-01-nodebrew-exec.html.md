---
title: nodebrewにexecコマンドを追加した
date: 2013-12-01 00:00 JST
tags: Node.js
---

Node.js Advent Calendar 1日目です。まだ空きがありますので、Node.jsネタあるよーという方ぜひ参加してみてください。

[Node.js Advent Calendar 2013](http://www.adventar.org/calendars/56)

さて、この前のNode学園祭2013のLTでもちょっと話したんですが、nodebrewに`exec`というコマンドを追加しました。

`exec`を使うと一時的に別のバージョンでNode.jsを実行することができるようになります。

    $ nodebrew exec <version> -- <command>

例えばこんな感じ。

    # 今使ってるバージョンは v0.10.21
    $ nodebrew ls
    v0.8.26
    v0.10.21

    current: v0.10.21

    # たしかに v0.10.21
    $ node -v
    v0.10.21

    # execで一時的に v0.8.26 を使いたい
    $ nodebrew exec v0.8.26 -- node -v
    v0.8.26

例えば試しにunstableなバージョンでアプリケーションを実行したりとか

    $ nodebrew exec v0.11.9 -- node app.js

ちょっと違うバージョンの動作を確認したいなーというときとか

    $ nodebrew exec v0.11.9 -- node
    > console.log(...)

こんな感じに使えます。

また、`node`コマンドに限らず、グローバルにインストールしたnpmモジュールも同じように実行できます。

    $ nodebrew exec v0.11.9 -- grunt

`selfupdate`コマンドでアップデートできるのでぜひお試しください。

    $ nodebrew selfupdate
