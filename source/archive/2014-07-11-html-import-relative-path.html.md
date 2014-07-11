---
title: HTML Importsで読み込まれたドキュメントからの相対パスを得る
date: 2014-07-11 13:00 JST
tags: WebComponents
---

[x-sushiyuki](https://github.com/hokaccha/x-sushiyuki)というsushiyukiを表示するためのWebComponentsの要素を作ったんだけれども、importされたファイルからの相対パスでsushiyukiの画像パスを指定するのにちょっと苦戦した。

たとえば、 /index.html から以下のように x-sushiyuki.html を呼び出す。

```html
<link rel="import" href="bower_components/x-sushiyuki/x-sushiyuki.html">
```

この x-sushiyuki.html に CustomElement で`<x-sushiyuki>`を登録する処理などがかかれているので、 /index.html では次のように`<x-sushiyuki>`が使えるようになる。

```html
<x-sushiyuki type="uni">うに</x-sushiyuki>
```

このようなコンポーネントをbowerなどで配布することを考えると、sushiyukiの画像はこのコンポーネントに含めたい。そうすると当然画像のパスは x-sushiyuki.html からの相対パスで解決したい。（1、2個くらいの画像だったらbase64で埋め込んでもいいけどsushiyukiは数が多いのでつらい）

普通に書くとこれが解決できない。例えば x-sushiyuki.html のほうで`img/uni.png`を`src`にした`img`要素をつくって`<x-sushiyuki>`のShadowDOMにappendしたとする。しかしこのShadowDOMが展開されるのは index.html のほうなので index.html からの相対パスで解決される。

これを解決する方法がよくわからなかったのでなんとか無理矢理解決した方法を紹介する。

まず x-sushiyuki.html のほうのscript要素の中では`document.currentScript`で自分自信のscript要素を取得できる（platform.jsでPolyfillする場合は`document._currentScript`）。

次に`currentScript.ownerDocument`で自分自身の`document`を取得できる。そして`document`には`baseURI`というプロパティがあって、これで自分のドキュメントが参照されているURLが取れる。例えばこんな感じ。

```javascript
var currentScript = document._currentScript || document.currentScript;
var doc = currentScript.ownerDocument;
console.log(doc.baseURI); //=> http://localhsot:8000/bower_components/x-sushiyuki/x-sushiyuki.html
```

あとはこのURLをパースして相対パスを取ればいい。こんな感じにした。

```javascript
function getCwd(url) {
  var a = document.createElement('a');
  a.href = url;

  var origin = a.protocol + '//' + a.host; // same as a.origin
  var pathname = a.pathname;

  // for IE10
  if (pathname[0] !== '/') {
    pathname = '/' + pathname;
  }

  return origin + pathname.replace(/\/[^\/]*$/, '');
}

var cwd = getCwd(doc.baseURI);
```

`a`要素でURLをパースして自分のファイルのディレクトリ的なのを返す。originもくっつけてるのは別のオリジンからこのドキュメントが読み込まれた場合にも対応するため。HTML ImportsはCORSに対応していればクロスオリジンで読み込めるので、CDNから読み込むとかもできそう。

後はこれに画像のパスをくっつければOK。

```javascript
img.src = cwd + '/img/' + type + '.png';
```

他にいい方法があれば知りたい所存。
