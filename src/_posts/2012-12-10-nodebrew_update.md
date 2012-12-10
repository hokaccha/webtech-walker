---
layout: posts
title: nodebrewでバイナリからインストールできるようにした
tags: 
  Node.js
---

[nodebrew](https://github.com/hokaccha/nodebrew)の0.6.0をリリースしました。`install-binary`というコマンドを追加しまして、コンパイル済みのバイナリからインストールできるようにしました。

バイナリのファイルはNode.jsのv0.8.6以降で配布されるようになったので、それ以前のバージョンはインストールできません。Mac OSX、Linux、Solaris用のがそれぞれ32bitと64bitのものが用意されていて、nodebrewがアーキテクチャから自動で判別してとってくるようにしています。OSXとUbuntuくらいでしか試してないので動かなかった場合は報告ください。

こんな感じです。

    $ nodebrew install-binary v0.8.6
    fetch: http://nodejs.org/dist/v0.8.6/node-v0.8.6-darwin-x64.tar.gz
    ######################################################################## 100.0%
    install success

これまでコンパイルが必要だったのでインストールに時間がかかっていましたが、バイナリだとダウンロードして展開するだけなんでちょっぱやで終わります。

最初は`install`コマンドと統合しようと思ったんだけどいきなり統合するのもアレなのでひとまず様子見で別コマンドにしてます。将来的には`install`コマンドに統合してオプションとかで切り替えられるようにするかもしれません。

あと、人知れずちょっと前のバージョンアップで[@hide\_o\_55](https://twitter.com/hide_o_55)さんが実装してくれた`migrate-package`というコマンドが入っています。これは`npm install -g`でグローバルにインストールしたモジュールを移行してくれるコマンドです。

    $ nodebrew migrate-package v0.6.4

とかやるとv0.6.4でグローバルにインストールされているモジュールをカレントのバージョンにも`npm install -g`でインストールしてくれます。便利。

`nodebrew selfupdate`コマンドでアップデートできるのでぜひ使ってみてください。
