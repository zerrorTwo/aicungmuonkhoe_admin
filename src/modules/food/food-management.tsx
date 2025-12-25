/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Typography, Table, Button, Space, Input, Image } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { Search } = Input

export default function FoodManagement() {
    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => <Image src={image} width={50} height={50} />,
        },
        {
            title: 'Tên món ăn',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Calories',
            dataIndex: 'calories',
            key: 'calories',
        },
        {
            title: 'Protein (g)',
            dataIndex: 'protein',
            key: 'protein',
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
            image: 'https://via.placeholder.com/50',
            name: 'Cơm gà',
            category: 'Món chính',
            calories: 450,
            protein: 25,
        },
        {
            key: '2',
            image: 'https://via.placeholder.com/50',
            name: 'Salad rau củ',
            category: 'Món phụ',
            calories: 120,
            protein: 5,
        },
    ]

    return (
        <div css={rootStyles}>
            <div css={headerStyles}>
                <Typography.Title level={4}>Quản lý món ăn</Typography.Title>
                <Button type="primary" icon={<PlusOutlined />}>
                    Thêm món ăn mới
                </Button>
            </div>

            <div css={searchStyles}>
                <Search placeholder="Tìm kiếm món ăn..." style={{ width: 400 }} />
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
