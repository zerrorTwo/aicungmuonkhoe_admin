/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Typography, Table, Button, Space, Input } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Search } = Input

export default function NotificationManagement() {
    const columns = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: () => (
                <Space>
                    <Button type="primary" icon={<EditOutlined />} size="small">Sửa</Button>
                    <Button danger icon={<DeleteOutlined />} size="small">Xóa</Button>
                </Space>
            ),
        },
    ]

    const data = [
        {
            key: '1',
            title: 'Thông báo 1',
            content: 'Nội dung thông báo 1',
            createdAt: '25/12/2024',
            status: 'Đã gửi',
        },
    ]

    return (
        <div css={rootStyles}>
            <div css={headerStyles}>
                <Typography.Title level={4}>Quản lý thông báo</Typography.Title>
                <Button type="primary" icon={<PlusOutlined />}>
                    Tạo thông báo mới
                </Button>
            </div>

            <div css={searchStyles}>
                <Search placeholder="Tìm kiếm thông báo..." style={{ width: 300 }} />
            </div>

            <Table columns={columns} dataSource={data} />
        </div>
    )
}

const rootStyles = css`
  background: var(--white-color);
  padding: var(--spacing-lg);
`

const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`

const searchStyles = css`
  margin-bottom: var(--spacing-md);
`
