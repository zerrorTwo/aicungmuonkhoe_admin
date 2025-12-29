/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Typography, Table, Button, Space, Input, Tag, Modal, message } from 'antd'
import { DeleteOutlined, LockOutlined, UnlockOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } from '@/redux/services/userApi'
import { useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import type { User } from '@/types/api.types'

const { Search } = Input
const { confirm } = Modal

export default function UserManagement() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500)

    const { data: userResponse, isLoading, isFetching } = useGetUsersQuery({
        page,
        limit: pageSize,
        search: debouncedSearch,
    })

    const [updateUser] = useUpdateUserMutation()
    const [deleteUser] = useDeleteUserMutation()

    const handleStatusChange = (record: User) => {
        const newStatus = record.STATUS_ACTIVE === 1 ? 0 : 1
        const actionText = newStatus === 1 ? 'mở khóa' : 'khóa'

        confirm({
            title: `Bạn có chắc chắn muốn ${actionText} người dùng này?`,
            icon: <ExclamationCircleOutlined />,
            content: `Người dùng: ${record.EMAIL}`,
            onOk: async () => {
                try {
                    await updateUser({ id: record.USER_ID, data: { STATUS_ACTIVE: newStatus } }).unwrap()
                    message.success(`Đã ${actionText} người dùng thành công`)
                } catch (error) {
                    message.error('Có lỗi xảy ra, vui lòng thử lại')
                }
            },
        })
    }

    const handleDelete = (record: User) => {
        confirm({
            title: 'Bạn có chắc chắn muốn xóa người dùng này?',
            icon: <ExclamationCircleOutlined />,
            content: `Thao tác này không thể hoàn tác. Người dùng: ${record.EMAIL}`,
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteUser(record.USER_ID).unwrap()
                    message.success('Đã xóa người dùng thành công')
                } catch (error) {
                    message.error('Có lỗi xảy ra, vui lòng thử lại')
                }
            },
        })
    }

    const columns = [
        {
            title: 'User ID',
            dataIndex: 'USER_ID',
            key: 'USER_ID',
            width: 80,
        },
        {
            title: 'Tên hiển thị',
            key: 'FULL_NAME',
            render: (record: User) => {
                const fullName = record.HEALTH_DOCUMENTS?.[0]?.FULL_NAME
                return fullName || 'Chưa cập nhật'
            },
        },
        {
            title: 'Email',
            dataIndex: 'EMAIL',
            key: 'EMAIL',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'PHONE',
            key: 'PHONE',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'STATUS_ACTIVE',
            key: 'STATUS_ACTIVE',
            render: (status: number) => (
                <Tag color={status === 1 ? 'green' : 'red'}>
                    {status === 1 ? 'Đã kích hoạt' : 'Đã bị khóa'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (record: User) => (
                <Space>
                    {record.STATUS_ACTIVE === 1 ? (
                        <Button
                            type="primary"
                            icon={<LockOutlined />}
                            size="small"
                            onClick={() => handleStatusChange(record)}
                        >
                            Khóa
                        </Button>
                    ) : (
                        <Button
                            icon={<UnlockOutlined />}
                            size="small"
                            onClick={() => handleStatusChange(record)}
                        >
                            Mở khóa
                        </Button>
                    )}
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDelete(record)}
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ]

    const users = userResponse?.data?.users || []
    const pagination = userResponse?.data?.pagination || { total: 0 }

    return (
        <div css={rootStyles}>
            <Typography.Title css={titleStyles} level={5}>
                Quản lý người dùng
            </Typography.Title>

            <div css={contentStyles}>
                <div css={headerStyles}>
                    <Search
                        placeholder="Tìm kiếm người dùng..."
                        style={{ width: 400 }}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="USER_ID"
                    scroll={{ x: 1000 }}
                    loading={isLoading || isFetching}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: pagination.total,
                        onChange: (p, ps) => {
                            setPage(p)
                            setPageSize(ps)
                        },
                        showSizeChanger: true,
                    }}
                />
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
  margin-bottom: 1.4rem;
`
