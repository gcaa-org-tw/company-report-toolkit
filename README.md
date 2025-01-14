# company-report-toolkit
協助工人、人工智慧，將企業永續報告書，轉為結構化資料 / A collection of toolkits to assist people &amp; AI to transfrorm ESG report into machine readable data.

- [專案共筆](https://g0v.hackmd.io/@ddio-io/open-csr-report)
- 專案聊天頻道: g0v slack#thaubing-esg

## 開發者資訊

這個專案正在（其實也沒那麼地）快速迭代中，架構、套件可能會隨時更改，請小心服用。

目前分為機個部份：

1. PDF 報告書前置處理 `/report-preprocessing`
   - 讓 UI 能夠搜尋 + 快速讀取
   - 把企業永續報告出，切成 10 頁一個檔案，然後需要手動上傳到某個 web hosting
   - 把所有文字，上傳到 Algolia 上
   - 使用 dotenv 管理 Algolia 變數
2. 網頁前端 `/toolkit-ui`
   - 分為群眾外包、專業志工模式
   - 目前主要在開發專業志工模式，需要用 Auth0 / Google 登入後，才可使用
   - 使用 Nuxt3 / Vue3 / TS （徵求 TS 熟手！）
   - 使用 dotenv 管理環境變數，詳見 [README](./toolkit-ui/README.md)
3. 網頁後端 `/toolkit-api`
   - 專業志工模式相關 API，只認前端來，而且是 Auth0 signed 的 JWT 
   - 使用 Feathers.js / koa / node / TS 
   - 使用 dotenv 管理環境變數，詳見 [README](./toolkit-api/README.md)

### 我想快快開始開發！

請找其他專案參與者，要一份開發用的後端 `.env` ，或是參閱 [API README](./toolkit-api/README.md)，
自己建立 auth0 ，做一份設定檔。

### Environment setup

This project builds on NodeJS (https://nodejs.org/en/download) and npm using the
current LTS (node v18.18.2 and npm 10 as of Oct 31, 2023).


```
# 先把後端跑起來 (run the development version of the API backend)
cd toolkit-api
# copy sample configuration to enable development authentication with auth0
cp env.example .env
npm install
npm run migrate
npm run dev

# 再塞點資料、建立報告書、公司
npx ts-node seeds/seed-company.ts
npx ts-node seeds/seed-field-meta.ts
npx ts-node seeds/seed-report.ts
npx ts-node seeds/seed-report-field.ts


# 然後把前端跑起來 (run the development version of the UI frontend)
cd ../toolkit-ui
cp env.example .env #如果後端使用自建的設定檔，請修改 auth0 相關變數
npm install

npm run dev
```

### 欄位定義

1. 請先從[這份試算表](https://g0v.hackmd.io/@ddio-io/open-csr-report/https%3A%2F%2Fdocs.google.com%2Fspreadsheets%2Fu%2F1%2Fd%2F1Ypq8uVsJoU4RhB4shdCrygKmk6Hm_OcqNR5QbBb5bSQ%2Fedit%23gid%3D0)
   下載最新的 CSV （請勿手改，方便非工程師核對），放到 toolkit-api/seeds/field-meta.csv ，再執行 seed-field-mets.ts 即可
