import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const Loading = () => (
    <Spin indicator={
        <LoadingOutlined
            style={{
                fontSize: 24,
                color: "white"
            }}
            spin
        />
    }/>
);

export default Loading;