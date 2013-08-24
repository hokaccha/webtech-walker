---
title: gitで差分ファイルを抽出する
tags: git
---

変更したファイルだけまとめて取り出したいというケースがけっこうあるみたいなんで書いてみた。

[gitの差分のファイルをつくる — Gist](https://gist.github.com/3764870)

こいつをパスが通ってるところに置いて実行権限つけたら

    $ git export-diff <commit> <output_dir>

こんな感じで実行すると`<commit>`からHEADまでの差分ファイルを`<output_dir>`にコピーする。`<commit>`の部分は`git diff`と同じ物が使えるので

    $ git export-diff HEAD^^^ path/to/dir
    $ git export-diff HEAD^^^..HEAD^ path/to/dir
    $ git export-diff <sha1> <sha1> path/to/dir
    $ git export-diff <sha1>..<sha1> path/to/dir

みたいな感じでもOK。
