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

### 分割 PDF

```
# 分割 PDF，假設 PDF 少於 9,999 頁
cpdf ./path/to/interpellation/data.pdf -split -chunk 10 -o 'path/to/csr/report/%%%.pdf'

# 壓縮 PDF
mkdir compressed
./minify-pdf.sh ./path/to/csr/report/ ./compressed
```

並將 PDF 上傳到合適的線上空間

### 準備 Algolia

1. 建立好空白的 index
2. 新增以下環境變數，可以放在系統中，或放在 `.env`
   - ALGOLIA_APP_ID
   - ALGOLIA_DATA_API_KEY # 有寫入權限的 API Key
   - ALGOLIA_INDEX_NAME

### 建立搜尋索引

```
node ./build-index.js -s <source pdf>  -i 統編 -y 資料年度
```


