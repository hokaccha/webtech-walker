---
layout: posts
title: flipsnap.jsでIE10のPointer Eventsに対応した
tags: JavaScript
---

flipsnap.jsをWindows8のIE10のタッチで動くようにしました。

[flipsnap.js](http://pxgrid.github.com/js-flipsnap/)

思ったより簡単に対応できました。diffはこんな感じ。

[IE10 for touch device support. Fix #13 · 0524fef · pxgrid/js-flipsnap](https://github.com/pxgrid/js-flipsnap/commit/0524fefdbd8e2b02625a00fada9e2d3f9c73b2ef)

IE10はiOSやAndroidのように`touchstart`や`touchmove`のようなタッチイベントが用意されておらず、代わりにタッチした際に、pointerイベントというイベントが発火します。

* [Pointer Events Specification](http://www.w3.org/Submission/pointer-events/)
* [Touch Input for IE10 and Metro style Apps - IEBlog - Site Home - MSDN Blogs](http://blogs.msdn.com/b/ie/archive/2011/09/20/touch-input-for-ie10-and-metro-style-apps.aspx)

まだ`MSPointerDown`のように`MS`というprefixがついています。

{% highlight javascript %}
element.addEventListener('MSPointerDown', function() {
  // タッチが始まった時の処理
}, false);

element.addEventListener('MSPointerMove', function() {
  // タッチが動いている時の処理
}, false);

element.addEventListener('MSPointerUp', function() {
  // タッチが終わった時の処理
}, false);
{% endhighlight %}

基本的にはmouseイベントやtouchイベントと同じように使えるので、イベント名だけ変更すれば対応はできます。また、`window.navigator.msPointerEnabled`の値を見てpointerイベントが使用可能かどうかを判断することができます。

{% highlight javascript %}
var support = {
  mspointer: window.navigator.msPointerEnabled,
  touch: 'ontouchstart' in window
};

var touchStartEvent =
    support.mspointer ? 'MSPointerDown' :
    support.touch ? 'touchstart' :
    'mousedown';

element.addEventListener(touchStartEvent, function() {
  // タッチが始まった時の処理
}, false);
{% endhighlight %}

また、1点注意が必要で、CSSで`-ms-touch-action: none;`というのを指定しないとタッチしたときにネイティブのスクロールなどが優先されてpointerイベントがちゃんと発火しません。JavaScriptからこのプロパティを設定するには次のようにします。

{% highlight javascript %}
if (support.mspointer) {
  element.style.msTouchAction = 'none';
}
{% endhighlight %}

CSSでやるならこうです。

{% highlight css %}
#element {
  -ms-touch-action: none;
}
{% endhighlight %}

今回のflipsnap.jsでの対応は将来的にまだpointerイベントがどうなるかわからないので`MS`のプレフィックス限定で対応しています。将来的にプレフィックスが外れたり他のブラウザでも対応が始まった場合はその都度対応していく予定です。
