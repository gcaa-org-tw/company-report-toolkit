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
./tools/minify-pdf.sh ./path/to/csr/report/ ./compressed
```

並將 PDF 上傳到合適的線上空間

### 建立搜尋索引





