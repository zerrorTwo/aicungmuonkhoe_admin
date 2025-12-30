import { UploadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import { Button, Form, Input, Row, Space, Typography, Upload, Select, Modal } from 'antd';
import CustomLabel from '@/components/custom-label';
import { useEffect, useState } from 'react';
// import { UNIT_OPTIONS } from '@/constants/type';
import { handlePositiveNumberInputKeyDown } from '@/utils/common';

// Mock UNIT_OPTIONS
const UNIT_OPTIONS = [
    { label: 'g', value: 'g' },
    { label: 'ml', value: 'ml' },
];

// Mock FoodQuantitative type
type FoodQuantitative = any;

type FoodQuantificationModalProps = {
    onCancel: () => void;
    nameFood: string;
    mode?: 'create' | 'edit';
    defaultValues?: FoodQuantitative;
    setListFoodQuantitative: React.Dispatch<React.SetStateAction<FoodQuantitative[]>>;
    foodId: string;
};


export const FoodManagementQuantificationModal = ({
    onCancel,
    nameFood,
    mode,
    defaultValues,
    setListFoodQuantitative,
    foodId
}: FoodQuantificationModalProps) => {
    const [form] = Form.useForm();
    const [fileImage, setFileImage] = useState<any[]>([]);
    const [fileImageCooked, setFileImageCooked] = useState<any[]>([]);


    const onFinish = async (values: any) => {
        if (mode === 'edit' && defaultValues) {
            const hasMassChanged = defaultValues.mass !== values.mass || defaultValues.unit !== values.unit;

            if (hasMassChanged) {
                Modal.info({
                    title: 'Thông báo',
                    content: `Bạn vừa thay đổi định lượng thực phẩm sống, mã ID của thực phẩm vẫn giữ nguyên là [${defaultValues.idDisplay}] tương ứng với khối lượng thực phẩm ${foodId} là [${values.mass}${values.unit}].`,
                    okText: 'Đồng ý',
                    onOk: () => {
                        setListFoodQuantitative(prev => {
                            return prev.map(item => {
                                if (item.id === defaultValues.id) {
                                    return {
                                        ...item,
                                        name: nameFood,
                                        mass: values.mass,
                                        unit: values.unit,
                                        quantitative: values.quantitative,
                                        unitQuantitative: values.unitQuantitative,
                                        image: fileImage?.[0]?.url || '',
                                        nameImage: fileImage?.[0]?.name || '',
                                        imageCooked: fileImageCooked?.[0]?.url || '',
                                        nameImageCooked: fileImageCooked?.[0]?.name || '',
                                        idDisplay: defaultValues.idDisplay
                                    };
                                }
                                return item;
                            });
                        });
                        onCancel();
                    }
                });
            } else {
                Modal.success({
                    title: 'Thông báo',
                    content: 'Lưu thành công',
                    okText: 'Đồng ý',
                    onOk: () => {
                        setListFoodQuantitative(prev => {
                            // Tìm item có mass & unit trùng với values
                            const existingItem = prev.find(
                                item =>
                                    item.mass === values.mass &&
                                    item.unit === values.unit
                            );

                            return prev.map(item => {
                                if (existingItem) {
                                    // Nếu tìm thấy, update item này
                                    if (item.id === existingItem.id) {
                                        return {
                                            ...item,
                                            name: nameFood,
                                            mass: values.mass,
                                            unit: values.unit,
                                            quantitative: values.quantitative,
                                            unitQuantitative: values.unitQuantitative,
                                            image: fileImage?.[0]?.url || '',
                                            nameImage: fileImage?.[0]?.name || '',
                                            imageCooked: fileImageCooked?.[0]?.url || '',
                                            nameImageCooked: fileImageCooked?.[0]?.name || '',
                                            idDisplay: `${foodId || ''}_${values.mass}${values.unit}`
                                        };
                                    }
                                } else {
                                    // Nếu không có mass & unit trùng, fallback về logic cũ: update theo defaultValues.id
                                    if (item.id === defaultValues.id) {
                                        return {
                                            ...item,
                                            name: nameFood,
                                            mass: values.mass,
                                            unit: values.unit,
                                            quantitative: values.quantitative,
                                            unitQuantitative: values.unitQuantitative,
                                            image: fileImage?.[0]?.url || '',
                                            nameImage: fileImage?.[0]?.name || '',
                                            imageCooked: fileImageCooked?.[0]?.url || '',
                                            nameImageCooked: fileImageCooked?.[0]?.name || '',
                                            idDisplay: defaultValues.idDisplay
                                        };
                                    }
                                }
                                return item;
                            });
                        });
                        onCancel();
                    }
                });
            }
        } else {
            const idDisplay = `${foodId || ''}_${values.mass || ''}${values.unit || ''}`;
            setListFoodQuantitative(prev => {
                const existingIndex = prev.findIndex(
                    item => item.mass === values.mass && item.unit === values.unit
                );

                const payload = {
                    id: existingIndex >= 0 ? prev[existingIndex].id : (prev.length > 0 ? prev[prev.length - 1].id + 1 : 1),
                    name: nameFood,
                    mass: values.mass,
                    unit: values.unit,
                    quantitative: values.quantitative,
                    unitQuantitative: values.unitQuantitative,
                    image: fileImage?.[0]?.url || '',
                    nameImage: fileImage?.[0]?.name || '',
                    imageCooked: fileImageCooked?.[0]?.url || '',
                    nameImageCooked: fileImageCooked?.[0]?.name || '',
                    idDisplay
                };

                if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = payload;
                    return updated;
                } else {
                    return [...prev, payload];
                }
            });

            onCancel();
        }
    };

    useEffect(() => {
        if (mode === 'edit' && defaultValues) {
            form.setFieldsValue({
                mass: defaultValues.mass,
                unit: defaultValues.unit,
                quantitative: defaultValues.quantitative,
                unitQuantitative: defaultValues.unitQuantitative,
                image: defaultValues.image,
                imageCooked: defaultValues.imageCooked
            });

            if (defaultValues.image) {
                setFileImage([{
                    uid: '-1',
                    name: defaultValues.nameImage || 'image.jpg',
                    url: defaultValues.image,
                    status: 'done'
                }]);
            } else {
                setFileImage([]);
            }
            if (defaultValues.imageCooked) {
                setFileImageCooked([{
                    uid: '-2',
                    name: defaultValues.nameImageCooked || 'image-cooked.jpg',
                    url: defaultValues.imageCooked,
                    status: 'done'
                }]);
            } else {
                setFileImageCooked([]);
            }
        } else {
            form.resetFields();
            setFileImage([]);
            setFileImageCooked([]);
        }
    }, [defaultValues, mode, form]);

    const ALLOWED_TYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
    ];

    const beforeUpload = (file: File) => {
        const isValidType = ALLOWED_TYPES.includes(file.type);
        if (!isValidType) {
            return Upload.LIST_IGNORE;
        }

        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            return Upload.LIST_IGNORE;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            return Upload.LIST_IGNORE;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const newFile = {
                uid: Date.now().toString(),
                name: file.name,
                url: reader.result,
                status: 'done',
                originFileObj: file
            };
            setFileImage([newFile]);
            form.setFieldValue('image', [newFile]);
        };
        return false;
    };

    const handleRemove = () => {
        setFileImage([]);
        form.setFieldValue('image', []);
        form.validateFields(['image']);
    };

    const beforeUploadCooked = (file: File) => {
        const isValidType = ALLOWED_TYPES.includes(file.type);
        if (!isValidType) {
            return Upload.LIST_IGNORE;
        }

        const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            return Upload.LIST_IGNORE;
        }

        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            return Upload.LIST_IGNORE;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const newFile = {
                uid: Date.now().toString(),
                name: file.name,
                url: reader.result,
                status: 'done',
                originFileObj: file
            };
            setFileImageCooked([newFile]);
            form.setFieldValue('imageCooked', [newFile]);
        };
        return false;
    };

    const handleRemoveCooked = () => {
        setFileImageCooked([]);
        form.setFieldValue('imageCooked', []);
        form.validateFields(['imageCooked']);
    };

    return (
        <Form form={form} validateTrigger='onSubmit' css={containerStyles} onFinish={onFinish}>
            <Typography.Title css={titleStyles} level={5}>
                Nhập định lượng thực phẩm
            </Typography.Title>
            <Row css={fieldStyles} gutter={16}>
                <Form.Item
                    name='mass'
                    label={CustomLabel({ text: 'Khối lượng thực phẩm sống', isRequired: true })}
                    rules={
                        [
                            { required: true, message: 'Vui lòng nhập khối lượng!' },
                            {
                                pattern: /^(?!0+(?:[.,]0+)?$)\d*(?:[.,]\d+)?$/,
                                message: 'Chỉ được nhập số lớn hơn 0'
                            }
                        ]
                    }
                    css={customLabel}
                    labelCol={{ span: 12 }}
                >
                    <Input
                        placeholder='Nhập khối lượng'
                        type='number'
                        onWheel={(e) => e.currentTarget.blur()}
                        onKeyDown={handlePositiveNumberInputKeyDown}
                    />
                </Form.Item>
                <Form.Item
                    name='unit'
                    rules={[{ required: true, message: 'Vui lòng nhập đơn vị!' }]}
                >
                    <Select placeholder='Chọn đơn vị' options={UNIT_OPTIONS} />
                </Form.Item>
            </Row>
            <Row css={fieldStyles} gutter={16}>
                <Form.Item
                    name='quantitative'
                    label={CustomLabel({ text: 'Khối lượng thực phẩm chín', isRequired: true })}
                    rules={[{ required: true, message: 'Vui lòng nhập khối lượng!' },
                    {
                        pattern: /^(?!0+(?:[.,]0+)?$)\d*(?:[.,]\d+)?$/,
                        message: 'Chỉ được nhập số lớn hơn 0'
                    }
                    ]}
                    css={customLabel}
                    labelCol={{ span: 12 }}
                >
                    <Input
                        placeholder='Nhập khối lượng'
                        type='number'
                        onKeyDown={handlePositiveNumberInputKeyDown}
                        onWheel={(e) => e.currentTarget.blur()}
                    />
                </Form.Item>
                <Form.Item
                    name='unitQuantitative'
                    rules={[{ required: true, message: 'Vui lòng nhập đơn vị!' }]}
                >
                    <Select placeholder='Chọn đơn vị' options={UNIT_OPTIONS} />
                </Form.Item>
            </Row>
            <Row css={uploadFieldStyles} gutter={16}>
                <Form.Item
                    name={'image'}
                    label={CustomLabel({ text: 'Hình ảnh sống', isRequired: true })}
                    rules={[
                        {
                            validator: (_,) => {
                                if (fileImage && fileImage.length > 0) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Vui lòng upload ảnh!'));
                            },
                        },
                    ]}
                    labelCol={{ span: 8 }}
                    css={uploadFormItemStyles}
                >
                    <Upload
                        maxCount={1}
                        beforeUpload={beforeUpload}
                        listType='picture'
                        accept='.png, .jpeg, .jpg'
                        onRemove={handleRemove}
                        fileList={fileImage}
                    >
                        <Button icon={<UploadOutlined />}>Chọn để tải lên hình ảnh</Button>
                    </Upload>
                </Form.Item>
            </Row>

            <Row css={uploadFieldStyles} gutter={16}>
                <Form.Item
                    name={'imageCooked'}
                    label={CustomLabel({ text: 'Hình ảnh chín', isRequired: true })}
                    rules={[
                        {
                            validator: (_,) => {
                                if (fileImageCooked && fileImageCooked.length > 0) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Vui lòng upload ảnh!'));
                            },
                        },
                    ]}
                    labelCol={{ span: 8 }}
                    css={uploadFormItemStyles}
                >
                    <Upload
                        maxCount={1}
                        beforeUpload={beforeUploadCooked}
                        listType='picture'
                        accept='.png, .jpeg, .jpg'
                        onRemove={handleRemoveCooked}
                        fileList={fileImageCooked}
                    >
                        <Button icon={<UploadOutlined />}>Chọn để tải lên hình ảnh</Button>
                    </Upload>
                </Form.Item>
            </Row>

            <Form.Item>
                <Space css={groupButtonStyles}>
                    <Button type='default' size='large' onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button type='primary' size='large' htmlType='submit'>
                        Lưu
                    </Button>
                </Space>
            </Form.Item>
        </Form>
    );
};

const containerStyles = css`
  padding: 0 2rem;

  .ant-form-item {
    .ant-form-item-label {
      display: flex;
      align-items: center;
      margin-right: 2rem;
      text-align: start;

      label {
        flex: 1;

        &::after,
        &::before {
          display: none !important;
        }
      }
    }
    .ant-form-item-control-input {
      .ant-input {
        font-size: 14px !important;
        padding: 0.8rem 1.2rem !important;
      }
    }

    .ant-form-item-control-input-content .ant-input {
      height: 3.2rem !important;
    }
  }

  .ant-upload-list-item-name,
  .ant-upload-list-item-info .ant-upload-list-item-name {
    max-width: 22rem;
  }
`;

const titleStyles = css`
  margin-bottom: 1.6rem !important;
  line-height: 3.2rem !important;
`;

const fieldStyles = css`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 1rem;

  .ant-select {
    min-width: 6.5rem;
  }
`;

const groupButtonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.6rem;
  margin-top: 1.6rem;

  button {
    padding: 2rem 4rem;
  }
`;

const customLabel = css`
  min-width: 39rem;
`;

const uploadFieldStyles = css`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 1rem;
`;

const uploadFormItemStyles = css`
  width: 60%;
  
  .ant-upload-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .ant-upload-list {
    width: 100%;
    margin-bottom: 8px;
  }

`
