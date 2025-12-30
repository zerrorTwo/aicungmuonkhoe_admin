import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import {
  Button,
  Col,
  Collapse,
  CollapseProps,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Typography
} from 'antd';
import { useGetMaterialGroupsQuery } from '@/redux/services/foodApi';


type FilterFood = any;

type FoodSliderSearcherProps = {
  onSearch: (values: FilterFood) => void;
};

export const FoodManagementSearcher = ({
  onSearch,
}: FoodSliderSearcherProps) => {
  const [form] = Form.useForm();

  const { data: listNutritionGroup = [] } = useGetMaterialGroupsQuery();

  const handleSearch = () => {
    const values = form.getFieldsValue();
    onSearch(values);
  }

  const handleClear = () => {
    form.resetFields();
    onSearch({});
  };

  const nutritionGroupOptions = listNutritionGroup.map((item: any) => ({
    label: item.NAME,
    value: item.CODE
  }));



  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <Typography.Title css={titleStyles} level={5}>
          BỘ LỌC
        </Typography.Title>
      ),
      children: (
        <Form form={form} css={formStyles}>
          <Row gutter={16} align='stretch'>
            <Col span={3} css={labelCol}>
              <label>Tên thực phẩm</label>
            </Col>
            <Col span={8} css={filterItem}>
              <Form.Item
                name='name'
                css={customLabel}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={13} css={filterItem}>
              <Form.Item
                label='Phân loại thực phẩm theo nhóm nguyên liệu'
                name='materialGroup'
                css={customLabel}
              >
                <Select
                  mode='multiple'
                  allowClear
                  options={nutritionGroupOptions} />
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={[8, 0]} align="middle" style={{ marginTop: '1rem' }}>
            <Col span={3}>
              <label>Thời gian cập nhật</label>
            </Col>
            <Col span={4}>
              <Form.Item name="startUpdateDate" noStyle>
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col style={{ textAlign: "center" }}>-</Col>
            <Col span={4}>
              <Form.Item name="endUpdateDate" noStyle>
                <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row
            gutter={16}
            align='middle'
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1rem'
            }}
          >
            <Button
              type='default'
              icon={<ReloadOutlined />}
              css={resetButton}
              onClick={handleClear}
            >
              Đặt lại
            </Button>
            <Button
              type='primary'
              icon={<SearchOutlined />}
              css={searchButton}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Row>
        </Form>
      )
    }
  ];
  return (
    <Row css={boxStyles} justify='space-between' align='middle'>
      <Collapse
        items={items}
        defaultActiveKey={'1'}
        expandIconPosition={'end'}
        css={collapseStyles}
      />
    </Row>
  );
};

const boxStyles = css`
  padding: 0 1rem;
  background: var(--white-color);
  box-shadow: 0.02rem 0.04rem 0.2rem var(--gray-light-color);
  &:nth-of-type(2) {
    padding: 1.6rem 1rem;
  }
`;

const collapseStyles = css`
  width: 100%;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
  background-color: transparent !important;

  .ant-collapse-header {
    width: fit-content;
    border-radius: 0.8rem !important;
    border: none !important;
    padding: 0 !important;

    .ant-collapse-expand-icon {
      align-self: center;
    }
  }

  .ant-collapse-content-box {
    padding: 0 !important;
  }

  .ant-collapse-content {
    border: none !important;
  }
`;

const titleStyles = css`
  margin-bottom: 0 !important;
  line-height: 3.2rem !important;
  font-weight: 700 !important;
`;

const formStyles = css`
  margin-top: 0.5rem;
  padding: 1rem;
`;

const filterItem = css`
  display: flex;
  justify-content: start !important;
  gap: 0.5rem;

  label {
    height: 100% !important;
  }

  .ant-form-item-label {
    width: fit-content;
    max-width: 33.33%;
    height: 100% !important;
    text-align: start !important;
    white-space: normal;
    font-size: 14px;
    font-weight: 500;
    word-wrap: break-word;
    word-break: break-word;
  }

  input,
  .ant-select,
  .ant-picker {
    flex: 1;
    min-width: 6rem;
  }
`;

const customLabel = css`
  .ant-form-item-label > label {
    font-weight: normal !important;

    &::after,
    &::before {
      display: none !important;
    }

    margin: 0 2rem 0 0 !important;
  }

  width: 100%;
  margin-bottom: 0;
`;

const resetButton = css`
  margin-right: 10px;
  color: #007bff;
  border-color: #007bff;
`;

const searchButton = css`
  background: #007bff;
  color: white;
  &:hover {
    background: #0056b3;
  }
`;

const labelCol = css`
  display: flex;
  align-items: flex-start;
  margin-top: 0.5rem;
`;
