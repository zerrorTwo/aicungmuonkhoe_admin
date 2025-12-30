import { useCallback, useEffect, useState } from 'react';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import {
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    Row,
    Select,
    Typography,
    Upload,
    notification
} from 'antd';
import { FoodManagementNutrientDetails } from '@/components/forms/food-management/nutrients.form';
import { FoodQuantificationTable } from '@/components/tables/food-management/food-management-quantification.table';
import { PageURLs } from '@/utils/navigate';
import { useQuery } from '@/hooks/query.hook';
import { PAGINATION_PARAMS as DEFAULT_PAGINATION_PARAMS } from '@/constants/pagination.constant';
import { handlePositiveNumberInputKeyDown } from '@/utils/common';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import {
    useCreateFoodMutation,
    useUpdateFoodMutation,
    useGetFoodByIdQuery,
    useGetMaterialGroupsQuery,
} from '@/redux/services/foodApi';

const YesNo = { Yes: 1, No: 0 };
type FoodQuantitative = any;
type Food = any;
const PermissionMode = { CREATE: 'CREATE', EDIT: 'EDIT' };

const FoodManagementCreateForm = () => {
    const [form] = Form.useForm();
    const { push, getSearchParam } = useQuery();
    const mode = getSearchParam('mode');
    const foodId = getSearchParam('foodId');

    const [createFood, { isLoading: isCreating }] = useCreateFoodMutation();
    const [updateFood, { isLoading: isUpdating }] = useUpdateFoodMutation();

    const { data: groupFoods = [] } = useGetMaterialGroupsQuery();

    // Fetch detail if edit
    const skipDetail = !foodId || mode !== PermissionMode.EDIT;
    const { data: detailFood } = useGetFoodByIdQuery(foodId, { skip: String(skipDetail) === 'true' });

    const [inputNameFood, setInputNameFood] = useState('');
    const [listFoodQuantitative, setListFoodQuantitative] = useState<FoodQuantitative[]>([]);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [btnIdFood, setBtnIdFood] = useState(false);

    useEffect(() => {
        if (detailFood?.IMAGE && mode === PermissionMode.EDIT) {
            setFileList([
                {
                    uid: "-1",
                    name: detailFood?.NAME || "image",
                    status: "done",
                    url: detailFood?.IMAGE,
                },
            ]);
        } else {
            setFileList([]);
        }
    }, [detailFood, mode]);

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const lastFile = newFileList[newFileList.length - 1];

        if (lastFile && lastFile.type) {
            const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(lastFile.type);
            if (!isImage) {
                return;
            }
        }

        setFileList(newFileList);
    };



    const foodGroupOptions = groupFoods.map((item: any) => ({
        label: item.NAME,
        value: item.CODE
    }));

    useEffect(() => {
        if (mode === PermissionMode.EDIT && detailFood) {
            const newValues = {
                ...detailFood,
            };
            form.setFieldsValue(newValues);
            setBtnIdFood(true);
        }
    }, [detailFood, form, mode]);

    const handleGoBack = useCallback(() => {
        push(PageURLs.ofFoodManagement());
    }, [push]);

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
            };
            form.setFieldValue('IMAGE', newFile.url);
        };
        return false;
    };

    const onFinish = async (values: Food) => {
        const formData = new FormData();
        const FILE_KEY = 'image';

        // Helper to append valid values
        const appendIfDefined = (key: string, value: any) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        };

        // Handle Image
        const currentFile = fileList.length > 0 ? fileList[0] : null;
        if (currentFile && currentFile.originFileObj) {
            // New file selected
            formData.append(FILE_KEY, currentFile.originFileObj);
        } else if (values.IMAGE && typeof values.IMAGE === 'string' && !values.IMAGE.startsWith('data:')) {
            // Existing URL - keep it
            formData.append('IMAGE', values.IMAGE);
        }

        // Append other fields
        Object.keys(values).forEach(key => {
            if (key !== 'IMAGE') {
                appendIfDefined(key, values[key]);
            }
        });

        try {
            if (mode === PermissionMode.EDIT) {
                await updateFood({ id: detailFood.ID, data: formData }).unwrap();
                notification.success({ message: 'Cập nhật thành công' });
            } else {
                await createFood(formData).unwrap();
                notification.success({ message: 'Tạo mới thành công' });
            }
            push(`${PageURLs.ofFoodManagement()}`);
        } catch (error: any) {
            notification.error({ message: error?.data?.message || 'Có lỗi xảy ra' });
        }
    };

    return (
        <Form form={form} css={rootStyles} onFinish={onFinish}>
            <Row css={boxStyles} align='middle' gutter={16}>
                <Button
                    type='text'
                    icon={<ArrowLeftOutlined />}
                    onClick={handleGoBack}
                ></Button>
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                    {mode === PermissionMode.EDIT ? 'Cập nhật dữ liệu thực phẩm' : 'Tạo mới dữ liệu thực phẩm'}
                </Typography.Title>
            </Row>

            <Row css={boxStyles} align='top' gutter={16}>

                <Col span={12} css={fieldStyles}>
                    <Form.Item
                        name={'GROUP_MATERIAL'}
                        label={'Nhóm thực phẩm'}
                        labelCol={{ span: 8 }}
                        rules={[{ required: true, message: 'Vui lòng điền thông tin!' }]}
                    >
                        <Select
                            placeholder='Chọn nhóm thực phẩm'
                            options={foodGroupOptions}
                        />
                    </Form.Item>
                </Col>



                <Col span={12} css={fieldStyles}>
                    <Form.Item
                        name={'ID'}
                        label={'ID thực phẩm'}
                        labelCol={{ span: 8 }}
                        rules={[
                            { required: true, message: 'Vui lòng điền thông tin!' },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder='Nhập ID thực phẩm'
                            disabled={mode === PermissionMode.EDIT}
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
                                if (
                                    !/[0-9]/.test(e.key) &&
                                    !allowedKeys.includes(e.key)
                                ) {
                                    e.preventDefault();
                                }
                            }}
                            onBlur={(e) => {
                                const value = e.target.value?.trim();
                                setBtnIdFood(!!value);
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col span={12} />

                <Col span={12} css={fieldStyles}>
                    <Form.Item
                        name={'NAME'}
                        label={'Tên thực phẩm'}
                        labelCol={{ span: 8 }}
                        rules={[{ required: true, message: 'Vui lòng điền thông tin!' }]}
                    >
                        <Input
                            placeholder='Nhập tên thực phẩm'
                            onChange={(e) => setInputNameFood(e.target.value)}
                        />
                    </Form.Item>
                </Col>
                <Col span={12} />



                <Col span={12} css={fieldStyles}>
                    <Form.Item
                        name={'IMAGE'}
                        label={'Ảnh thumbnail'}
                        labelCol={{ span: 8 }}
                        getValueFromEvent={(e) => {
                            const fl = Array.isArray(e) ? e : e?.fileList;

                            if (!fl || fl.length === 0) return "";

                            const file = fl[0];
                            return file.url || file.response?.url || "";
                        }}
                    >
                        <Upload
                            beforeUpload={beforeUpload}
                            listType='picture'
                            accept='.png, .jpeg, .jpg'
                            maxCount={1}
                            fileList={fileList}
                            onChange={handleChange}
                            onRemove={() => {
                                setFileList([]);
                            }}
                        >
                            <Button icon={<UploadOutlined />}>
                                Chọn để tải lên hình ảnh
                            </Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>

            <Row css={boxStyles} align='top' gutter={16}>

                <Col span={24} css={fieldStyles}>
                    <Typography>
                        Thông tin dinh dưỡng của thực phẩm chứa trong 100g thực phẩm
                    </Typography>
                </Col>

                <Col span={24} css={fieldStyles}>
                    <FoodManagementNutrientDetails />
                </Col>
            </Row>

            <Row css={groupButtonStyles} align='top' gutter={16}>
                <Button type='default' size='large' onClick={handleGoBack}>
                    Hủy
                </Button>

                <Form.Item noStyle>
                    <Button type='primary' size='large' htmlType='submit' loading={isCreating || isUpdating}>
                        Lưu
                    </Button>
                </Form.Item>
            </Row>
        </Form>
    );
};
export default FoodManagementCreateForm;
const rootStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
  min-height: calc(100vh - var(--header-height));
`;

const boxStyles = css`
  padding: 1rem;
  background: var(--white-color);
  border-radius: 1rem;
  box-shadow: 0.02rem 0.04rem 0.2rem var(--gray-light-color);
  &:nth-of-type(2) {
    padding: 1.6rem 1rem;
  }
`;

const fieldStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .ant-form-item {
    width: 100%;
    margin-bottom: 6px;

    .ant-form-item-row {
      display: flex;
      justify-content: space-between;
    }

    .ant-form-item-label {
      text-align: start !important;

      label {
        white-space: normal;
        height: auto;
        line-height: 1.5;
        font-weight: bold;
      }
    }
  }

  .ant-typography {
    font-weight: bold;
  }

  input {
    flex: 1;
  }
`;

const groupButtonStyles = css`
  padding: 1rem;
  background: var(--white-color);
  border-radius: 1rem;
  box-shadow: 0.02rem 0.04rem 0.2rem var(--gray-light-color);
  &:nth-of-type(2) {
    padding: 1.6rem 1rem;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  gap: 1.6rem;

  button {
    padding: 1rem 10rem;
  }
`;
