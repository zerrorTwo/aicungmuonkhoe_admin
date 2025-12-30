/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button, Col, Form, Row, Space, Typography } from 'antd';
import { FoodManagementNutrientDetails } from '../../forms/food-management/nutrients.form';
// import {
//   getDetailFood,
//   watchDetailFoodById,
// } from '@/redux/slices/food.slice';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect } from 'react';
import { useQuery } from '@/hooks/query.hook';
// import { PermissionMode } from '@/enums/mode.enum';
// import { PageURLs } from '@/utils/navigate';
import usePermission from '@/hooks/permission.hook';

const IMAGE_DEFAULT = '/assets/images/image_default.png';

// Mock FoodManagementNutrientDetails removed


type FoodInformationModalProps = {
    food: any;
    onCancel: () => void;
};

export const FoodManagementInformationModal = ({
    food,
    onCancel
}: FoodInformationModalProps) => {
    const [form] = Form.useForm();
    // const detailFood = useAppSelector(watchDetailFoodById);
    // const dispatch = useAppDispatch();
    const detailFood = food; // Mocking detailFood as passed food

    const { push } = useQuery();
    const { updatable } = usePermission();

    const PageURLs = { ofFoodManagement: () => '/food-v1' }
    const PermissionMode = { EDIT: 'EDIT' }

    useEffect(() => {
        // dispatch(getDetailFood(food.ID));
    }, [food]);

    useEffect(() => {
        if (detailFood) {
            form.setFieldsValue(detailFood);
        }
    }, [detailFood, form]);

    const onEdit = () => {
        onCancel();
        push(
            `${PageURLs.ofFoodManagement()}?mode=${PermissionMode.EDIT}&foodId=${food.ID}`
        );
    }
    return (
        <Form form={form} validateTrigger='onSubmit' css={containerStyles}>
            <Typography.Title css={titleStyles} level={5}>
                Thông tin thực phẩm
            </Typography.Title>

            <Row align={'middle'} justify={'center'} gutter={32}>
                <Col>
                    <img
                        src={detailFood?.IMAGE || IMAGE_DEFAULT}
                        style={{ width: '100px', aspectRatio: '3/2', objectFit: 'cover' }}
                    />
                </Col>
                <Typography.Title level={4}>{food.NAME}</Typography.Title>
            </Row>

            <Row>
                <Typography>
                    Thông tin dinh dưỡng của thực phẩm chứa trong 100g thực phẩm, bao gồm
                    các thông tin bên dưới:
                </Typography>
                <FoodManagementNutrientDetails food={food} />
            </Row>

            <Form.Item>
                <Space css={groupButtonStyles}>
                    <Button type='default' size='large' onClick={onCancel}>
                        Đóng
                    </Button>
                    {updatable && (
                        <Button type='primary' size='large' onClick={onEdit}>
                            Chỉnh sửa
                        </Button>
                    )}
                </Space>
            </Form.Item>
        </Form>
    );
};

const containerStyles = css`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-height: 90vh;

  overflow-y: auto;
  overflow-x: hidden;  
  -ms-overflow-style: none; 
  scrollbar-width: none;  

  &::-webkit-scrollbar {
    display: none; 
  }
`;

const titleStyles = css`
  margin-bottom: 1.6rem !important;
  line-height: 3.2rem !important;
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
