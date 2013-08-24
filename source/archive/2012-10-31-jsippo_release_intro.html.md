---
title: 「ノンプログラマのためのJavaScriptはじめの一歩」の1章が公開されました
tags: 
  - JavaScript
  - book
---

11/7発売予定の書籍「[ノンプログラマのためのJavaScriptはじめの一歩](http://www.amazon.co.jp/dp/4774153761)」のはじめにと1章が先行して技評のWebサイトで公開されました。

* [はじめに](http://gihyo.jp/magazine/wdpress/plus/978-4-7741-5376-6/0001)
* [1章](http://gihyo.jp/magazine/wdpress/plus/978-4-7741-5376-6/0002)

1章はイントロ的なところで、JavaScriptを学ぶ前にJavaScriptの動かし方やデバッグツールの使い方について解説しています。

また、本書籍の2章以降で解説するスライドショーのサンプルプログラムも1章で登場するため公開されています。次のようにボタンを押すと次の画像に行くというだけの、簡単なサンプルプログラムです。

{::nomarkdown}
<figure>
<iframe src="/sample/2012-10-31-jsippo_release_intro/index.html" width="650" height="550" frameborder="none" style="border: 1px solid #000; background: #FFF; margin: 0 auto;"></iframe>
</figure>
{:/nomarkdown}

[技評のWebサイト](http://image.gihyo.co.jp/assets/files/book/2012/978-4-7741-5376-6/chapter1/1-5-1_slideshow-1/index.html)からも実際に試すことができます。

JavaScriptのソースはこんなかんじです。全体で90行程度、コメントや空行を除くと40行程度です。

```javascript
/**
 * 簡易スライドショー
 *
 * nextボタンを押したときに画像を切り替える簡単な
 * スライドショーのサンプルプログラムです。
 */

window.onload = function() {

    /*============================
     * 変数の定義
     *===========================*/

    // 写真のリストの定義
    var photoList = [
        { src: 'img/spring.jpg', title: '春の桜' },
        { src: 'img/summer.jpg', title: '夏のひまわり' },
        { src: 'img/autumn.jpg', title: '秋の紅葉' },
        { src: 'img/winter.jpg', title: '冬の山' }
    ];
    var photoLength = photoList.length;

    // 要素の取得
    var photo = document.getElementById('photo');
    var nextBtn = document.getElementById('nextBtn');
    var title = document.getElementById('title');

    // 現在のインデックスを保存するための変数
    var currentIndex = 0;

    /*============================
     * 関数の定義
     *===========================*/

    // 指定の写真に表示を切り替える関数
    function showPhoto(index) {
        // 全ての画像を非表示
        for (var i = 0; i < photoLength; i++) {
            photoList[i].elem.style.display = 'none';
        }

        // 表示する対象の要素を取得
        var targetPhoto = photoList[index];

        // タイトルを表示
        var viewNumber = index + 1;
        title.innerHTML = '[' + viewNumber + '] ' + targetPhoto.title;

        // 画像を表示
        targetPhoto.elem.style.display = 'inline';
    }

    /*============================
     * イベントの設定
     *===========================*/

    // nextボタンのイベントを設定
    nextBtn.onclick = function() {
        // 表示するインデックスを計算
        currentIndex++;
        if (currentIndex === photoLength) {
            currentIndex = 0;
        }

        // 画像を切り替える
        showPhoto(currentIndex);
    };

    /*============================
     * 初期化処理
     *===========================*/

    // img要素をHTMLに追加
    var item, img;
    for (var i = 0; i < photoLength; i++) {
        item = photoList[i];

        // img要素を作成
        img = document.createElement('img');

        // 作成したimg要素に属性を設定
        img.src = item.src;
        img.alt = item.title;

        // 作成したimg要素をHTMLに追加
        photo.appendChild(img);

        // 作成したimg要素を保存
        item.elem = img;
    }

    // 初期表示のためにshowPhotoを一度だけ実行する
    showPhoto(currentIndex);
};
```

見る人が見れば突っ込みどころもあるとは思いますが、ひとつのサンプルにループや分岐や関数、イベントやDOM操作など、できるだけ詰め込んで何度もリライトした結果こうなっています。

本書籍ではこのサンプルプログラムを完全に理解することを一つの目標にしています。

2章と3章ではJavaScriptの文法やDOMの基本を解説するのですが、文法や機能を解説するごとに、このプログラムのどこでそれが使われているかを確認し、実際にどのように使われるかを解説したり、どこまでサンプルプログラムを理解できたかを細かく振り返ります。

そして4章ではこのプログラムの流れを解説しながら「読む」ということと、どのようにして一からこのプログラムを「書く」かという二つの視点からプログラムの全体像について解説します。

最後に5章でjQueryについて解説してこのスライドショーをjQueryでも書いてみて、アニメーションなどの機能を付け加えた、より実践的なプログラムにするというのが全体の構成です。

もし1章とサンプルプログラムを見て興味を持った方は購入をご検討ください！

<figure>
  <a href="http://amazon.jp/dp/4774153761">
  <img src="/img/posts/2012-10-23-jsippo/cover.png" alt="ノンプログラマのための JavaScriptはじめの一歩" width="400" height="568">
  <figcaption>Amazon.co.jp： ノンプログラマのための JavaScriptはじめの一歩</figcaption>
  </a>
</figure>
