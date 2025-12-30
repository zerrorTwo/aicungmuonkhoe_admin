import CustomLabel from '@/components/custom-label';
import FOOD_NUTRIENTS from '@/constants/food-nutrients.constant';
import { css } from '@emotion/react';
import { Col, Form, Input, Row } from 'antd';
import { handlePositiveNumberInputKeyDown } from '@/utils/common';

export const FoodManagementNutrientDetails = ({ food }: { food?: any }) => {
    const totalRow = Math.round(Object.keys(FOOD_NUTRIENTS).length / 2);

    const firstPart: Record<string, any> = {};
    const secondPart: Record<string, any> = {};

    Object.keys(FOOD_NUTRIENTS).forEach((key, index) => {
        if (index < totalRow) firstPart[key] = FOOD_NUTRIENTS[key];
        else secondPart[key] = FOOD_NUTRIENTS[key];
    });

    const getPropertyValue = (object: any, key: string) =>
        object && typeof object[key] !== 'undefined' ? object[key] : undefined;

    return (
        <div css={containerStyles}>
            <Row gutter={16}>
                {[firstPart, secondPart].map((part, colIndex) => (
                    <Col span={12} key={`col-${colIndex}`}>
                        {Object.keys(part).map((key) => (
                            <Row align={'middle'} css={fieldStyles} key={key}>
                                <Form.Item
                                    name={FOOD_NUTRIENTS[key].name}
                                    label={CustomLabel({ text: FOOD_NUTRIENTS[key].title, isRequired: FOOD_NUTRIENTS[key].isRequired })}
                                    labelCol={{ span: 8 }}
                                    rules={[
                                        {
                                            required: FOOD_NUTRIENTS[key].isRequired,
                                            message: 'Vui lòng nhập thông tin!'
                                        },
                                        {
                                            pattern: /^(?!0+(?:[.,]0+)?$)\d*(?:[.,]\d+)?$/,
                                            message: 'Chỉ được nhập số lớn hơn 0'
                                        }
                                    ]}
                                    getValueFromEvent={(e) => {
                                        const value = e?.target?.value;
                                        return value === '' ? null : value;
                                    }}
                                    initialValue={getPropertyValue(food, FOOD_NUTRIENTS[key].name)}
                                >
                                    <Input
                                        type='number'
                                        suffix={FOOD_NUTRIENTS[key].unit}
                                        onWheel={(e) => e.currentTarget.blur()}
                                        onKeyDown={handlePositiveNumberInputKeyDown}
                                    />
                                </Form.Item>
                            </Row>
                        ))}
                    </Col>
                ))}
            </Row>
        </div>
    );
};

const containerStyles = css`
  width: 100%;
  margin-top: 1rem;
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
        font-size: inherit !important;
        white-space: normal;
        height: auto;
        line-height: 1.5;

        &::after {
          display: none !important;
        }

        &::before {
          display: none !important;
        }
      }
    }
  }

  input {
    flex: 1;
  }

  .ant-input-affix-wrapper {
    font-size: inherit !important;
  }
`;
