---
title: peco、ghq、gh-openの組み合わせが捗る
date: 2014-06-24 17:03 JST
tags:
  - CLI
  - git
---

それぞれのツールは以下を見ればどんなのかわかると思う。

* [peco（Simplistic interactive filtering tool）を作った話 : D-7 <altijd in beweging>](http://lestrrat.ldblog.jp/archives/39427929.html)
* [ghq: リモートリポジトリのローカルクローンをシンプルに管理する - 詩と創作・思索のひろば (Poetry, Writing and Contemplation)](http://motemen.hatenablog.com/entry/2014/06/01/introducing-ghq)
* [GitHubのレポジトリURLを開くgh-openコマンド - unknownplace.org](http://unknownplace.org/archives/gh-open.html)

pecoとghqを組み合わせる例はpecoのREADMEにあるようにかなり強力で、ghqで管理しているリポジトリのディレクトリにcdしたりするのに便利。

こんな感じ。

```
$ cd $(ghq list -p | peco)
```

また、typester先生作のgh-openは指定したディレクトリのリポジトリをGitHubで開けるので、同じように使えばpecoでGitHubのURLを開ける。

```
$ gh-open $(ghq list -p | peco)
```

こんな感じで適当にエイリアス作って使ってる。エイリアス名はだいぶ適当。

```
alias g='cd $(ghq list -p | peco)'
alias gh='gh-open $(ghq list -p | peco)'
```

捗る。
