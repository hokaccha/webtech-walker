---
title: 'Re: Single Page Application ではない場合 JavaScript コードのエントリポイントはどこにあるべきか？'
date: 2014-03-31 14:47 JST
tags: JavaScript
---

[Single Page Application ではない場合 JavaScript コードのエントリポイントはどこにあるべきか？ - @kyanny's blog](http://blog.kyanny.me/entry/2014/03/31/033140)

Backbone.Routerは基本的にhistory APIやhashchangeを使ったSPAのためのルーティングをしてくれるものなので、SPAじゃない場合に使うのはあんまりオススメできない。

方法は色々だと思うけど、自分の場合はそういうケースでは次のような簡易的なURL Dispatcherを書いて対応することが多い。

[dispacher.js](https://gist.github.com/hokaccha/9885783)

これをこんな感じで使う。

```javascript
// main.js
new Dispatcher()
  .route('.*',            'Common')
  .route('/',             'Top')
  .route('/user/([^/]+)', 'User')
  .dispatch({
    path: location.pathname,
    actions: MyApp.Actions
  });
```

```javascript
// actions/common.js
MyApp.Actions.Common = function(path) {
  // 全ページで共通の処理
};

// actions/top.js
MyApp.Actions.Top = function(path) {
  // トップページのときの処理
};

// actions/user.js
MyApp.Actions.User = function(path, id) {
  // /user/100 のときは id に 100 が渡ってくる
};
```

単に正規表現でURLをディスパッチしてるだけなので、そんなにかっこよくは書けないけど、わりと柔軟に書けるし実装も小さくて手を入れやすいのである程度の規模ならこれでなんとかなることは多い。

あと、SPAとSPAじゃないページが混じってるアプリケーションもわりと多いので、その場合はこのDispathcerでルーティングした先でBackbone.Routerを初期化するとかいうケースもあったりする。
