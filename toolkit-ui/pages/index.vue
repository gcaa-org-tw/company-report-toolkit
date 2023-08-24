<template lang="pug">
.landingWrapper.flex.items-center.ph3
  .landing.center.mw8.lh-copy
    h1.tc.f3.f1-ns 開放企業永續資料庫 - 人工智慧補完計畫
    p.f4.tc.mw7.center
      | 永續報告書，是企業對外溝通的重要管道，我們想要使用公開資料，加上企業發佈的永續報告書，建立開放、有共同標準的開放資料庫，
      | 讓我們使用同一套標準，依據不同產業，驗證企業的永續報告書，促進產業轉型。
    .flex.flex-wrap.justify-center.mt3
      nuxt-link.landing__category.dim(to="/crowd-source")
        h2.f3 路過的鄉民
        p 一起來試試業界最尖端（？）的工人智慧吧！
        p 你將協助我們標記永續報告書中的資料，以及驗證其他人標記的結果，不只能夠充實資料庫，也能讓我們將填答流程，做得更流暢。
        p.landing__disclaimer 為了改善填答流程，我們將會收集你標注的資料，以及紀錄搜尋的歷史、瀏覽過的報告書頁次。由於這些資料無涉識別性，我們會將這些資料以 CC0 公開，讓大家一起來分析。
        .b.f4.tr 開始標記 →
      nuxt-link.landing__category.dim(to="/call-for-g0ver")
        h2.f3 專業工人
        p 受過工人培訓的你，來一起建立更完整的企業資料庫吧！
        p 你將可以跳過群眾外包的流程，直接將資料貢獻給我們，讓資料庫更加完整。
        p.landing__disclaimer 為了改善填答流程，我們將會收集你標注的資料，以及紀錄搜尋的歷史、瀏覽過的報告書頁次。由於這些資料無涉識別性，我們會將這些資料以 CC0 公開，讓大家一起來分析。
        .b.f4.tr 開始標記 →
</template>
<style lang="scss" scoped>
.landingWrapper {
  min-height: calc(100vh - 5rem);
}

.landing {
  &__category {
    width: 25rem;
    max-width: calc(100vw - 4rem);
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    padding: 2rem;
    margin-bottom: 1.5rem;
    color: #000;
    text-decoration: none;

    + .landing__category {
      margin-left: 1.5rem;
    }

    p {
      color: #444;
    }
  }

  p.landing__disclaimer {
    color: #888;
    font-size: 0.75rem;
  }
}
</style>
