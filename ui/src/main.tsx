import { ConfigProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'dayjs/locale/es';
import locale from 'antd/locale/es_ES';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { MyStore } from './state/store'
const tz = "America/New_York"

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={MyStore}>
    <React.StrictMode>
      <ConfigProvider locale={locale}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </React.StrictMode>
  </Provider>
)
