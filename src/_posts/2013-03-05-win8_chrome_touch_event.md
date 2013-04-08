---
layout: posts
title: Windows8のChromeやFirefoxはタッチイベントとマウスイベント両方考慮すべし
tags: JavaScript
---

タッチ系の操作をスマホでもデスクトップPCでも動くようにするため、タッチイベントがある場合は`touchstart`や`touchmove`を使い、タッチイベントをサポートしていないブラウザでは`mousedown`や`mousemove`を使って同じ挙動にするというケースがあります。

例えばこういうやつ。

[flipsnap.js DEMO](http://pxgrid.github.com/js-flipsnap/demo.html)

そのようなケースでは僕はこれまで次のように書いていました。

{% highlight javascript %}
var supportTouch = 'ontouchstart' in window;

var touchStartEvent = supportTouch ? 'touchstart' : 'mousedown';
var touchMoveEvent = supportTouch ? 'touchmove' : 'mousemove';
var touchEndEvent = supportTouch ? 'touchend' : 'mouseup';

element.addEventListener(touchStartEvent, function() { ... }, false);
element.addEventListener(touchMoveEvent, function() { ... }, false);
element.addEventListener(touchEndEvent, function() { ... }, false);
{% endhighlight %}

タッチ系のイベントがあるかどうかでバインドするイベントを決める感じです。

しかし、これだとWindows8のChromeやFirefoxでマウスの操作が動きません。Windows8のChromeやFirefoxはタッチイベントをサポートしており、画面をタッチして操作した場合はタッチ系のイベントが、マウスで操作した場合はマウス系のイベントが発火するようになっています。

なので上記のような処理だとタッチ系のイベントしかハンドラがバインドされず、マウスで操作しようとしたときに何もおきないということになります。

対応方法は色々あると思うけど、flipsnap.jsでは`touchstart`と`mousedown`の両方にイベントをバインドしておいて、それらのイベントリスナの中でmoveイベントとendイベントをバインドし、endイベントでリスナを解除するみたいな感じにしました。

ちなみにWindows8のIE10の場合はまたちょっと話が違ってきていて、MSPointerというポインターイベントがあってそれはこの前書いたのでそっちを参照のこと。

[flipsnap.jsでIE10のPointer Eventsに対応した - Webtech Walker](http://webtech-walker.com/archive/2012/11/flipsnap_ie10_pointerevents.html)
