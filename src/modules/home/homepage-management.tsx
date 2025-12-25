/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Typography, Table, Button, Space, Switch, Image } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

export default function HomepageManagement() {
    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image: string) => <Image src={image} width={100} height={60} />,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Vị trí',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Hiển thị PC',
            dataIndex: 'showPC',
            key: 'showPC',
            render: (checked: boolean) => <Switch checked={checked} />,
        },
        {
            title: 'Hiển thị Mobile',
            dataIndex: 'showMobile',
            key: 'showMobile',
            render: (checked: boolean) => <Switch checked={checked} />,
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
            image: 'https://via.placeholder.com/100x60',
            title: 'Banner chào mừng',
            position: 'Header',
            showPC: true,
            showMobile: true,
        },
        {
            key: '2',
            image: 'https://via.placeholder.com/100x60',
            title: 'Banner khuyến mãi',
            position: 'Slider',
            showPC: true,
            showMobile: false,
        },
    ]

    return (
        <div css={rootStyles}>
            <div css={headerStyles}>
                <Typography.Title level={4}>Quản lý trang chủ</Typography.Title>
                <Button type="primary" icon={<PlusOutlined />}>
                    Thêm banner mới
                </Button>
            </div>

            <Typography.Title level={5} css={sectionTitleStyles}>
                Banner Header
            </Typography.Title>
            <Table columns={columns} dataSource={data} />

            <Typography.Title level={5} css={sectionTitleStyles}>
                Banner Slider
            </Typography.Title>
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

const sectionTitleStyles = css`
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
`
