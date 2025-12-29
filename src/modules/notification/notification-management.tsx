/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Typography, Table, Button, Space, Input, Tag } from 'antd'
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
            render: (status: string) => (
                <Tag color={status === 'Đã gửi' ? 'green' : 'gray'}>
                    {status}
                </Tag>
            ),
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
            <Typography.Title css={titleStyles} level={5}>
                Quản lý thông báo
            </Typography.Title>

            <div css={contentStyles}>
                <div css={headerStyles}>
                    <Search placeholder="Tìm kiếm thông báo..." style={{ width: 300 }} />
                    <Button type="primary" icon={<PlusOutlined />}>
                        Tạo thông báo mới
                    </Button>
                </div>

                <Table columns={columns} dataSource={data} />
            </div>
        </div>
    )
}

const rootStyles = css`
  background: var(--gray-soft-color);
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: 1.4rem 2.4rem 0;
  min-height: calc(100vh - var(--header-height));
`

const titleStyles = css`
  padding: 1.4rem;
  background: var(--white-color);
  margin-bottom: 0 !important;
  border-radius: 1rem;
`

const contentStyles = css`
  background: var(--white-color);
  padding: 1.4rem;
  border-radius: 1rem;
  flex: 1;
`

const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.4rem;
`
