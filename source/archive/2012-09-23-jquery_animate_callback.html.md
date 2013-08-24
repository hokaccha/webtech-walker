---
title: jQueryでアニメーション終了時のcallback
tags: 
  - jQuery
  - JavaScript
---

jQueryでfadeOutとかのアニメーションして終わったらなんかするといったときにcallback関数を引数に指定するのとDeferred使う方法があるんだけどこの二つは挙動が違う。

こういうHTMLがあったとして

```html
<div>foo</div>
<div>bar</div>
<div>baz</div>
```

まず以下のようなcallback関数の場合はそれぞれのfadeOutが終わるごとに呼ばれる。

```javascript
$('div').fadeOut(function() {
  console.log('fin');
});
```

つまり`'fin'`が3回出力される。

一方Deferredを使った場合はこんな感じ。

```javascript
$('div').fadeOut.promise().done(function() {
  console.log('fin');
});
```

`.promise()`がDeferredオブジェクトを返すので`.done`に設定した関数がアニメーション終了時に呼ばれる。こっちは全てのアニメーションが終わった時点で呼ばれるので`'fin'`は一回しか呼ばれない。という違いがあるみたい。
