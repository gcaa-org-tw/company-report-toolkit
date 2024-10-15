# Web PDF Reader / PDF 線上閱讀器

An online PDF reader to optiomize rendering and search speed for large PDF file.
Madiran will be the major language of this project.

我是一個為了最佳化開啟、讀取、以及搜尋速度而設計的 PDF 閱讀器。

## 系統需求

1. [cpdf](https://community.coherentpdf.com/)
2. [ghostscript](https://ghostscript.com/)
1. [pdf2html 相關 Java 套件](https://www.npmjs.com/package/pdf2html)
3. [Algolia 帳號](https://www.algolia.com/)

## 準備工作

### 一鍵完成

1. 建立好空白的 index
2. 新增以下環境變數，可以放在系統中，或放在 `.env`
   - ALGOLIA_APP_ID
   - ALGOLIA_DATA_API_KEY # 有寫入權限的 API Key
   - ALGOLIA_INDEX_NAME
3. 將企業報告以 `<公司名或簡稱>-<資料年度>.pdf` 命名，注意年度必須是資料年度，而不是出版年度

```
node ./process-reports.js -s <list of pdf>
```

### 建立搜尋索引（已包含在一鍵完成中）
```
node ./build-index.js -s <source pdf>  -i 統編 -y 資料年度
```


### 將 PDF 切成小塊（已包含在一鍵完成中）

```
# 假設 PDF 少於 9,999 頁
./split-n-minify.sh ./path/to/csr/report.pdf ./path/to/output/dir
```

並將 PDF 上傳到合適的線上空間


