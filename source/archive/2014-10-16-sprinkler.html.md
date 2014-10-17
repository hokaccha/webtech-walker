---
title: GoでEnd To End Testingフレームワーク書いた
date: 2014-10-16 23:24 JST
tags:
  - Selenium
  - Go
---

SeleniumラッパーなテストフレームワークをGoで書いてみた。初Go。

[https://github.com/hokaccha/sprinkler](https://github.com/hokaccha/sprinkler)

GoのコードでE2Eテストのコード書けてもあんまり嬉しくないのでYAMLで書けるようにした。

```
scenarios:
- name: Hello sprinkler!
  actions:
  - visit: http://www.google.com
  - assert_title: Google
  - wait_for: input[type="text"]
  - input:
      element: input[type="text"]
      value: Hello
  - submit: form[name="f"]
  - wait: 1000
  - assert_text:
      element: "#main"
      contain: Hello
```

こんな感じのYAMLを以下のように実行すると

```
$ sprinkler hello.yml
```

ブラウザが立ち上がってYAMLに書いたコマンドやアサーションを実行する。

<iframe src="//player.vimeo.com/video/109134889" width="600" height="380" frameborder="0"></iframe>

[example](https://github.com/hokaccha/sprinkler/tree/master/example)にある機能はひと通り動くものの、まだだいぶ機能たりない感じなんで地道に実装していく予定。
