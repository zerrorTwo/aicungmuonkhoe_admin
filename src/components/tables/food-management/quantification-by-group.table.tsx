/** @jsxImportSource @emotion/react */
import { handleDownload } from '@/utils/common';
import {
    ArrowLeftOutlined,
    DeleteOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Row, Typography, Form, notification, message } from 'antd';
import { useCallback, useRef, useState } from 'react';
import { useQuery } from '@/hooks/query.hook';
import { useImportFoodMutation } from '@/redux/services/foodApi';
import { PageURLs } from '@/utils/navigate';

export default function FoodQuantificationByGroupTable() {
    const [form] = Form.useForm();
    const [file, setFile] = useState<File | null>(null);
    const { back, push } = useQuery();
    const [fileName, setFileName] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Use RTK Query mutation for importing food
    const [importFood, { isLoading }] = useImportFoodMutation();

    const handleUpload = async () => {
        if (!selectedFile) {
            message.error("Vui lòng chọn file để tải lên");
            return;
        }
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            await importFood(formData).unwrap();
            notification.success({
                message: 'Thành công',
                description: 'Import dữ liệu thực phẩm thành công!',
            });
            handleCancel();
        } catch (error: any) {
            const errorMsg = error?.data?.message || 'Có lỗi xảy ra khi import dữ liệu.';
            notification.error({
                message: 'Lỗi',
                description: errorMsg,
            });
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            setFileName(file.name);
            setSelectedFile(file);
            setFile(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setSelectedFile(file);
            setFile(file);
        }
    };

    const handleDelFile = () => {
        setFile(null);
        setFileName(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }


    const handleGoBack = useCallback(() => {
        // Navigate back to the main food management list
        push(PageURLs.ofFoodManagement());
    }, [push]);

    const handleCancel = () => {
        setFileName(null);
        setSelectedFile(null);
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDownLoadTemplateFood = async () => {
        // Placeholder for template download if needed.
        message.info("Chức năng tải template chưa được tích hợp.");
    }

    return (
        <>
            <Form form={form} css={rootStyles}>
                <div css={rootStyles}>
                    <Row css={boxStyles} align='middle' gutter={16}>
                        <Button
                            type='text'
                            icon={<ArrowLeftOutlined />}
                            onClick={handleGoBack}
                        ></Button>
                        <Typography.Title level={5} style={{ marginBottom: 0 }}>
                            Import Dữ liệu Thực phẩm
                        </Typography.Title>
                    </Row>

                    <div css={boxStyles}>
                        <Row>
                            <Button type='primary' icon={<UploadOutlined />}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Tải lên
                            </Button>
                            <Button type='link'
                                onClick={() => handleDownLoadTemplateFood()}
                            >
                                Tải xuống template
                            </Button>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Typography.Text style={{ marginRight: 10 }}>
                                {fileName}
                            </Typography.Text>
                            <DeleteOutlined
                                hidden={!file}
                                style={{ fontSize: 18, cursor: 'pointer', color: 'red' }}
                                onClick={() => handleDelFile()}
                            />
                        </Row>
                    </div>
                    <div css={boxStyles}>
                        <label
                            htmlFor="file-upload"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            style={{ width: '100%', display: 'block' }}
                        >
                            <div
                                style={{
                                    minHeight: '40vh',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '1px dashed #d9d9d9',
                                    borderRadius: '8px',
                                    backgroundColor: '#fafafa',
                                    cursor: 'pointer'
                                }}
                            >
                                <Typography.Title level={5} style={{ color: '#888' }}>
                                    {fileName ? `Đã chọn: ${fileName}` : 'Vui lòng kéo thả hoặc chọn file dữ liệu (ZIP/Excel)'}
                                </Typography.Title>
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".zip,.xlsx,.xls"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                        </label>
                    </div>
                    <div css={styleFooter}>
                        <Row align='top' gutter={16}>
                            <Button
                                type='default'
                                size='large'
                                onClick={handleCancel}
                            >
                                Hủy
                            </Button>

                            <Form.Item noStyle>
                                <Button type='primary'
                                    size='large'
                                    htmlType='submit'
                                    onClick={handleUpload}
                                    loading={isLoading}
                                    style={{ marginLeft: 20 }}
                                >
                                    Lưu
                                </Button>
                            </Form.Item>
                        </Row>
                    </div>
                </div>
            </Form>
        </>
    );
}

const styleFooter = css`
  min-height: calc(12vh - var(--header-height));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0 1rem;
  background-color: var(--white-color);
  .ant-btn-lg {
    width: 30rem;
  }
`;

const rootStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
  min-height: calc(100vh - var(--header-height));

  .ant-table-thead > tr > th {
    background: var(--blue-dark-color) !important;
    color: var(--white-color);
  }

  .ant-table-cell::before {
    display: none;
  }
`;

const boxStyles = css`
  padding: 1rem;
  background: var(--white-color);
  border-radius: 1rem;
  box-shadow: 0.02rem 0.04rem 0.2rem var(--gray-light-color);
`;
