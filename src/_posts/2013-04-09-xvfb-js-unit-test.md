---
layout: posts
title: Ubuntu上でXvfbを使ってJavaScriptのユニットテストをChromeとFirefoxで実行する
tags: 
  - JavaScript
---

JavaScriptのユニットテストをJenkinsとかでCIしたいとき、PhantomJSで実行するのもいいけどやっぱりChromeとかFirefoxみたいな実際のブラウザでテストしたい。でも環境作るのめんどくさいよなーと思ってたけどXvfbを使うとChromeとかFirefoxが動くのでLinux版のChromeとFirefoxだけだとわりと簡単に環境つくれた。

Xvfbというのは画面入出力をシミュレートするやつでデスクトップ環境を用意しなくてもChromeとかFirefoxとかが動かせるやつ。

OSはUbuntsの12.04（precise64）で試した。

まずXvfbを入れる。

    $ sudo apt-get install xvfb

次にFirefoxを入れる。これもすぐ入る。

    $ sudo apt-get install firefox

Chromeは一手間必要だけどわりとすぐ入る。

    $ wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
    $ sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
    $ sudo apt-get update
    $ sudo apt-get install google-chrome-stable

参考: [UbuntuにGoogle Chromeをインストールする - しがないまんとはなんですと！](http://shiganaiman.hatenablog.com/entry/2012/01/24/120405)

ユニットテストを実行するのには[Testem](https://github.com/airportyh/testem)を使ってみた。Testemはテストランナーのツールでユニットテストの自動実行とかをしてくれるやつ。

Node.jsは入ってる前提で、npmでインストール。

    $ npm install testem

そしたら`testem launchers`コマンドで今実行できるブラウザが表示されるので見てみる。

    $ ./node_modules/.bin/testem launchers
    Have 2 launchers available; auto-launch info displayed on the right.

    Launcher      Type          CI  Dev
    ------------  ------------  --  ---
    Firefox       browser       ✔           
    Chrome        browser       ✔ 

ちゃんとFirefoxとChromeがある！

そして、適当にtestemの設定ファイルとテストファイルを用意する。

    # testem.yml
    framework: mocha
    src_files:
      - expect.js
      - test.js

{% highlight javascript %}
// test.js
describe('document.body.tagName', function() {
  it('should be BODY', function() {
    expect(document.body.tagName).to.be('BODY');
  });
});
{% endhighlight %}

これでテストは通るはずだけどまだこのままだと動かない。

    $ ./node_modules/.bin/testem ci
    # Launching Firefox
    # 
    TAP version 13
    not ok 1 - Firefox "undefined"
      ---
        message: "Exited with code 1"
      ...

    # Launching Chrome
    # 
    not ok 2 - Chrome "undefined"
      ---
        message: "Exited with code 1"
      ...


    1..2
    # tests 2
    # fail  2

なぜならまだXvfbを立ち上げてないのでディスプレイがなくてFirefoxもChromeも起動できない。

なのでXvfbを立ち上げる。ホントはちゃんと起動スクリプトとか書いたほうがいいんだろうけどとりあえず適当に。

    $ Xvfb :99 -screen 0 1024x768x24 > /dev/null 2>&1 &

これで`:99.0`でXvfbが立ち上がったのでこれを環境変数で指定してtestemを実行する。

    $ DISPLAY=:99.0 ./node_modules/.bin/testem ci
    # Launching Firefox
    # .
    TAP version 13
    ok 1 - Firefox document.body.tagName should be BODY

    # Launching Chrome
    # .
    ok 2 - Chrome document.body.tagName should be BODY


    1..2
    # tests 2
    # pass  2

    # ok

そうするとちゃんとFirefoxとChromeでテストが実行される。すごい。後はこれをJenkinsとかで走らせればOK。たぶんSeleniumのテストとかもこれで走らせられるね。

ちなみにTravis CIはXvfbに対応してるんだけど現時点ではFirefoxしか入ってないっぽい。

[Travis CI: GUI & Headless browser testing on travis-ci.org](http://about.travis-ci.org/docs/user/gui-and-headless-browsers/)

関係ないけどVagrant使うとこういうの手軽にまっさらな環境で試せるので楽チン。
