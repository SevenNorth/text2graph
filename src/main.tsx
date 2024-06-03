import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { theme } from './theme.ts';
import './index.less';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigProvider theme={theme} locale={zhCN}>
            <AntdApp component={false}>
                <App />
            </AntdApp>
        </ConfigProvider>
    </React.StrictMode>,
);
