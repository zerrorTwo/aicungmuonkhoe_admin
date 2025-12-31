import { useCallback, useEffect, useState } from 'react';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
    Typography,
    Upload,
    notification
} from 'antd';
import { PageURLs } from '@/utils/navigate';
import { useQuery } from '@/hooks/query.hook';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import {
    useCreateDishMutation,
    useUpdateDishMutation,
    useGetDishByIdQuery,
    useGetDishAgesQuery,
    useGetDishRegionsQuery,
    useGetDishCookingMethodsQuery,
    useGetDishMealStructuresQuery,
} from '@/redux/services/dishApi';
import { Dish } from '@/types/dish';

const PermissionMode = { CREATE: 'CREATE', EDIT: 'EDIT' };

const DishManagementCreateForm = () => {
    const [form] = Form.useForm();
    const { push, getSearchParam } = useQuery();
    const mode = getSearchParam('mode');
    const dishId = getSearchParam('id');

    const [createDish, { isLoading: isCreating }] = useCreateDishMutation();
    const [updateDish, { isLoading: isUpdating }] = useUpdateDishMutation();

    const { data: ages = [] } = useGetDishAgesQuery();
    const { data: regions = [] } = useGetDishRegionsQuery();
    const { data: cookingMethods = [] } = useGetDishCookingMethodsQuery();
    const { data: mealStructures = [] } = useGetDishMealStructuresQuery();

    // Fetch detail if edit
    const skipDetail = !dishId || mode !== PermissionMode.EDIT;
    const { data: detailDish } = useGetDishByIdQuery(dishId, { skip: String(skipDetail) === 'true' });

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (detailDish?.SMALL_IMAGE && mode === PermissionMode.EDIT) {
            setFileList([
                {
                    uid: "-1",
                    name: "thumbnail",
                    status: "done",
                    url: detailDish?.SMALL_IMAGE,
                },
            ]);
        } else {
            setFileList([]);
        }
    }, [detailDish, mode]);

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleGoBack = useCallback(() => {
        push(PageURLs.ofDishManagement());
    }, [push]);

    // Adaptation of food form logic
    useEffect(() => {
        if (mode === PermissionMode.EDIT && detailDish) {
            form.setFieldsValue(detailDish);
        }
    }, [detailDish, form, mode]);


    const onFinish = async (values: Dish) => {
        const formData = new FormData();
        const FILE_KEY = 'SMALL_IMAGE'; // Assuming similar to food

        // Helper to append
        const appendIfDefined = (key: string, value: any) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        };

        // Handle Image
        const currentFile = fileList.length > 0 ? fileList[0] : null;
        if (currentFile && currentFile.originFileObj) {
            formData.append(FILE_KEY, currentFile.originFileObj);
        } else if (values.SMALL_IMAGE && typeof values.SMALL_IMAGE === 'string' && !values.SMALL_IMAGE.startsWith('data:')) {
            formData.append('SMALL_IMAGE', values.SMALL_IMAGE);
        }

        Object.keys(values).forEach(key => {
            if (key !== 'SMALL_IMAGE') {
                appendIfDefined(key, values[key as keyof Dish]);
            }
        });

        try {
            if (mode === PermissionMode.EDIT) {
                await updateDish({ id: detailDish.ID, data: formData }).unwrap();
                notification.success({ message: 'Cập nhật món ăn thành công' });
            } else {
                await createDish(formData).unwrap();
                notification.success({ message: 'Tạo món ăn thành công' });
            }
            push(`${PageURLs.ofDishManagement()}`);
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
                    {mode === PermissionMode.EDIT ? 'Cập nhật món ăn' : 'Tạo mới món ăn'}
                </Typography.Title>
            </Row>

            <Row css={boxStyles} align='top' gutter={16}>

                <Col span={12} css={fieldStyles}>
                    <Form.Item
                        name={'ID'}
                        label={'ID món ăn'}
                        labelCol={{ span: 8 }}
                        rules={[{ required: true, message: 'Vui lòng điền thông tin!' }]}
                    >
                        <Input disabled={mode === PermissionMode.EDIT} placeholder='Nhập ID món ăn' />
                    </Form.Item>
                </Col>
                <Col span={12} css={fieldStyles}>
                    <Form.Item
                        name={'NAME'}
                        label={'Tên món ăn'}
                        labelCol={{ span: 8 }}
                        rules={[{ required: true, message: 'Vui lòng điền thông tin!' }]}
                    >
                        <Input placeholder='Nhập tên món ăn' />
                    </Form.Item>
                </Col>

                {/* Dropdowns for associated IDs */}
                <Col span={12} css={fieldStyles}>
                    <Form.Item name={'AGE_GROUP_ID'} label={'Độ tuổi'} labelCol={{ span: 8 }}>
                        <Select options={ages.map((a: any) => ({ label: a.DESCRIPTION || a.NAME, value: a.ID }))} placeholder="Chọn độ tuổi" />
                    </Form.Item>
                </Col>
                <Col span={12} css={fieldStyles}>
                    <Form.Item name={'REGION_ID'} label={'Vùng miền'} labelCol={{ span: 8 }}>
                        <Select options={regions.map((r: any) => ({ label: r.regionName, value: r.regionId }))} placeholder="Chọn vùng miền" />
                    </Form.Item>
                </Col>
                <Col span={12} css={fieldStyles}>
                    <Form.Item name={'COOKING_METHOD_ID'} label={'Phương pháp nấu'} labelCol={{ span: 8 }}>
                        <Select options={cookingMethods.map((c: any) => ({ label: c.name, value: c.id }))} placeholder="Chọn phương pháp" />
                    </Form.Item>
                </Col>
                <Col span={12} css={fieldStyles}>
                    <Form.Item name={'MEAL_STRUCTURE_ID'} label={'Cấu trúc bữa ăn'} labelCol={{ span: 8 }}>
                        <Select options={mealStructures.map((m: any) => ({ label: m.name, value: m.id }))} placeholder="Chọn cấu trúc" />
                    </Form.Item>
                </Col>

                <Col span={12} css={fieldStyles}>
                    <Form.Item name={'SMALL_IMAGE'} label={'Ảnh món ăn'} labelCol={{ span: 8 }}>
                        <Upload
                            listType='picture'
                            maxCount={1}
                            fileList={fileList}
                            onChange={handleChange}
                            beforeUpload={() => false} // Manual upload
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    </Form.Item>
                </Col>

                <Col span={24} css={fieldStyles} style={{ display: 'block' }}>
                    <Form.Item name={'COOKING_INSTRUCTION'} label={'Hướng dẫn nấu'} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Col>
                <Col span={24} css={fieldStyles} style={{ display: 'block' }}>
                    <Form.Item name={'TIPS'} label={'Mẹo'} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                        <Input.TextArea rows={2} />
                    </Form.Item>
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
    )
}

export default DishManagementCreateForm;

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
    .ant-form-item-label {
      text-align: start !important;
      label {
        font-weight: bold;
      }
    }
  }
`;

const groupButtonStyles = css`
  padding: 1rem;
  background: var(--white-color);
  border-radius: 1rem;
  box-shadow: 0.02rem 0.04rem 0.2rem var(--gray-light-color);
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  gap: 1.6rem;

  button {
    padding: 1rem 10rem;
  }
`;
