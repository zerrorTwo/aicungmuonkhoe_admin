/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Typography, Table, Button, Space, Input, Tag } from 'antd'
import { EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'

const { Search } = Input

export default function UserManagement() {
    const columns = [
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 100,
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? 'Đã kích hoạt' : 'Đã bị khóa'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: any) => (
                <Space>
                    {record.status === 'active' ? (
                        <Button type="primary" icon={<LockOutlined />} size="small">Khóa</Button>
                    ) : (
                        <Button icon={<UnlockOutlined />} size="small">Mở khóa</Button>
                    )}
                    <Button danger icon={<DeleteOutlined />} size="small">Xóa</Button>
                </Space>
            ),
        },
    ]

    const data = [
        {
            key: '1',
            userId: 'U001',
            fullName: 'Nguyễn Văn A',
            phone: '0123456789',
            email: 'nguyenvana@example.com',
            status: 'active',
        },
        {
            key: '2',
            userId: 'U002',
            fullName: 'Trần Thị B',
            phone: '0987654321',
            email: 'tranthib@example.com',
            status: 'blocked',
        },
    ]

    return (
        <div css={rootStyles}>
            <Typography.Title level={4}>Quản lý người dùng</Typography.Title>

            <div css={searchStyles}>
                <Search placeholder="Tìm kiếm người dùng..." style={{ width: 400 }} />
            </div>

            <Table columns={columns} dataSource={data} scroll={{ x: 1000 }} />
        </div>
    )
}

const rootStyles = css`
  background: var(--white-color);
  padding: var(--spacing-lg);
`

const searchStyles = css`
  margin-bottom: var(--spacing-md);
`
