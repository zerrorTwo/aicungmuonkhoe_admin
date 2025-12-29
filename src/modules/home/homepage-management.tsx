/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Typography, Table, Button, Space, Switch, Image, Modal, Form, Input, Upload, message, Tooltip, Pagination } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useGetBannersQuery, useCreateBannerMutation, useUpdateBannerMutation, useDeleteBannerMutation } from '../../redux/services/bannerApi'
import { Banner } from '../../types/api.types'
import { useDebounce } from '../../hooks/useDebounce'
import type { UploadFile } from 'antd/es/upload/interface'

export default function HomepageManagement() {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebounce(search, 500)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [form] = Form.useForm()

    const { data, isLoading } = useGetBannersQuery({
        page,
        limit: pageSize,
        search: debouncedSearch,
    })

    const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation()
    const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation()
    const [deleteBanner] = useDeleteBannerMutation()

    const handleOpenModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner)
            form.setFieldsValue({
                TITLE: banner.TITLE,
                ACTIVE: banner.ACTIVE,
            })
            if (banner.IMAGE) {
                setFileList([{
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: banner.IMAGE,
                }])
            } else {
                setFileList([])
            }
        } else {
            setEditingBanner(null)
            form.resetFields()
            setFileList([])
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingBanner(null)
        setFileList([])
        form.resetFields()
    }

    const handleSubmit = async (values: any) => {
        const formData = new FormData()
        formData.append('TITLE', values.TITLE)
        formData.append('ACTIVE', values.ACTIVE ? 'true' : 'false')

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('IMAGE', fileList[0].originFileObj)
        }

        try {
            if (editingBanner) {
                await updateBanner({ id: editingBanner.ID, data: formData }).unwrap()
                message.success('Cập nhật banner thành công')
            } else {
                await createBanner(formData).unwrap()
                message.success('Tạo banner mới thành công')
            }
            handleCloseModal()
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại')
        }
    }

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa banner này không?',
            onOk: async () => {
                try {
                    await deleteBanner(id).unwrap()
                    message.success('Xóa banner thành công')
                } catch (error) {
                    message.error('Xóa banner thất bại')
                }
            },
        })
    }

    const handleStatusChange = async (checked: boolean, banner: Banner) => {
        const formData = new FormData()
        formData.append('ACTIVE', checked ? 'true' : 'false')
        try {
            await updateBanner({ id: banner.ID, data: formData }).unwrap()
            message.success('Cập nhật trạng thái thành công')
        } catch (error) {
            message.error('Cập nhật trạng thái thất bại')
        }
    }

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'IMAGE',
            key: 'IMAGE',
            render: (image: string) => image ? <Image src={image} width={100} height={60} style={{ objectFit: 'cover' }} /> : 'Không có ảnh',
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'TITLE',
            key: 'TITLE',
            render: (text: string) => <Typography.Text>{text}</Typography.Text>,
        },
        {
            title: 'Active',
            dataIndex: 'ACTIVE',
            key: 'ACTIVE',
            render: (checked: boolean, record: Banner) => (
                <Switch
                    checked={checked}
                    onChange={(val) => handleStatusChange(val, record)}
                    loading={isUpdating && editingBanner?.ID === record.ID}
                />
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'CREATED_AT',
            key: 'CREATED_AT',
            render: (text: string) => <Typography.Text>{new Date(text).toLocaleDateString('vi-VN')}</Typography.Text>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record: Banner) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleOpenModal(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.ID)} />
                    </Tooltip>
                </Space>
            ),
        },
    ]

    return (
        <div css={rootStyles}>
            <Typography.Title css={titleStyles} level={5}>
                Quản lý trang chủ
            </Typography.Title>

            <div css={contentStyles}>
                <div css={headerStyles}>
                    <Input.Search
                        placeholder="Tìm kiếm banner..."
                        onSearch={setSearch}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: 300, marginRight: 'auto' }}
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>
                        Thêm banner mới
                    </Button>
                </div>

                <Typography.Title level={5} css={sectionTitleStyles}>
                    Banner Slider
                </Typography.Title>

                <Table
                    columns={columns}
                    dataSource={data?.listData || []}
                    loading={isLoading}
                    rowKey="ID"
                    pagination={false}
                />

                {data?.paging && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={data.paging.total}
                            onChange={(p, ps) => {
                                setPage(p)
                                setPageSize(ps)
                            }}
                        />
                    </div>
                )}
            </div>

            <Modal
                title={editingBanner ? 'Cập nhật banner' : 'Thêm banner mới'}
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ ACTIVE: true }}
                >
                    <Form.Item
                        name="TITLE"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input placeholder="Nhập tiêu đề banner" />
                    </Form.Item>

                    <Form.Item
                        name="ACTIVE"
                        label="Trạng thái"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item label="Hình ảnh">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                            beforeUpload={() => false} // Prevent auto upload
                            maxCount={1}
                        >
                            {fileList.length < 1 && (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 0 }}>
                        <Space>
                            <Button onClick={handleCloseModal}>Hủy</Button>
                            <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                                {editingBanner ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
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
  display: flex;
  flex-direction: column;
  overflow: auto;
`

const headerStyles = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1.4rem;
`

const sectionTitleStyles = css`
  margin-top: 1.4rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
`

const tableStyles = css`
  margin-bottom: 2rem;
`
