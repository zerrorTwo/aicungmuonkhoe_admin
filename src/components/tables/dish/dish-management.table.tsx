/** @jsxImportSource @emotion/react */
import {
    Col,
    Row,
    Table,
    TableColumnsType,
    Tooltip,
    Button as ButtonAnt,
    Modal,
    Typography,
    notification,
    Image
} from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
const IMAGE_DEFAULT = '/assets/images/image_default.png';
import { css } from '@emotion/react';
import { useCallback, useState } from 'react';
import { DishManagementSearcher } from '@/components/forms/dish/searcher.form';
import { PAGINATION_PARAMS } from '@/constants/pagination.constant';
import { useQuery } from '@/hooks/query.hook';
import { useGetDishesQuery, useDeleteDishMutation } from '@/redux/services/dishApi';
import { Dish } from '@/types/dish';
import usePermission from '@/hooks/permission.hook';
import { formatDateToHHmmDDMMYYYY } from '@/utils/common';

type PageChangeParams = {
    offset?: number;
    pageSize?: number;
    filter?: any;
};

export default function DishManagementTable() {
    const [filter, setFilter] = useState<any>({});
    const [pagination, setPagination] = useState({
        curPage: 1,
        limitPage: 10,
    });

    const { data: dishResponse, isLoading } = useGetDishesQuery({
        page: pagination.curPage,
        limit: pagination.limitPage,
        ...filter,
    });

    const [deleteDish] = useDeleteDishMutation();
    const { push } = useQuery();
    // Assuming permission hook works generically or defaults to true for dev
    const { updatable, deletable } = usePermission() || { updatable: true, deletable: true };

    const PageURLs = {
        ofDishManagementCreate: () => '/dish/create',
        ofDishManagementEdit: (id: string) => `/dish/edit/${id}` // Define generic edit route
    }

    // Fallback if usePermission is strict
    // const updatable = true;
    // const deletable = true;

    const handlePageChange = useCallback(
        ({
            offset = PAGINATION_PARAMS.offset,
            pageSize = PAGINATION_PARAMS.limit,
            filter
        }: PageChangeParams) => {
            setPagination({
                curPage: offset || 1,
                limitPage: pageSize || 10
            });
        },
        []
    );

    const handleSearch = (values: any) => {
        const isReset = Object.keys(values).length === 0;
        const newFilter: any = {};

        if (!isReset) {
            if (values.name) newFilter.name = values.name;
        }

        setFilter(newFilter);
        setPagination(prev => ({ ...prev, curPage: 1 }));
    };

    const handleEdit = (dish: Dish) => {
        // Navigate to edit page
        // Since we didn't strictly define edit route in navigate.ts yet properly with ID param in base,
        // let's use query param pattern for now as per plan or consistent with port.
        // Food uses ?mode=EDIT&foodId=...
        // Let's stick to the route we defined: /dish-management/create?mode=EDIT&id=... or separate
        push(`/dish/create?mode=EDIT&id=${dish.ID}`);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDish(id).unwrap();
            notification.success({ message: 'Xoá món ăn thành công' });
        } catch (error) {
            notification.error({ message: 'Xoá món ăn thất bại' });
        }
    };

    const confirmDelete = (id: string) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn xoá món ăn này?',
            content: (
                <em>
                    Dữ liệu không thể khôi phục
                </em>
            ),
            okText: 'Xóa',
            width: 450,
            cancelText: 'Hủy',
            onOk: () => handleDelete(id)
        });
    };

    const columns: TableColumnsType<Dish> = [
        {
            title: 'STT',
            render: (_, __, index) => (pagination.curPage - 1) * pagination.limitPage + index + 1,
            width: 60,
        },
        {
            title: 'ID',
            dataIndex: 'ID',
            key: 'ID',
            width: 100,
        },
        {
            title: 'Tên món ăn',
            dataIndex: 'NAME',
            key: 'NAME',
            width: 200,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'SMALL_IMAGE',
            key: 'SMALL_IMAGE',
            render: (src) => (
                <Image
                    src={src || IMAGE_DEFAULT}
                    alt='Dish Thumbnail'
                    width={50}
                    height={32}
                    style={{ objectFit: 'cover' }}
                />
            )
        },
        {
            title: 'Độ tuổi',
            dataIndex: 'AGE_GROUP_ID', // Can map to name if data available
            key: 'AGE_GROUP_ID',
            width: 120,
        },
        {
            title: 'Vùng miền',
            dataIndex: 'REGION_ID', // Can map to name if data available
            key: 'REGION_ID',
            width: 100,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'CREATED_AT',
            key: 'CREATED_AT',
            width: 150,
            render: (date) => date ? formatDateToHHmmDDMMYYYY(date) : '',
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 104,
            render: (_, record) => (
                <Row gutter={4} wrap={false}>
                    {/* View/Edit share same form often */}
                    <Col>
                        <Tooltip title='Cập nhật'>
                            <ButtonAnt
                                onClick={() => handleEdit(record)}
                                type='primary'
                                icon={<EditOutlined />}
                                css={editButtonStyles}
                            />
                        </Tooltip>
                    </Col>
                    <Col>
                        <Tooltip title='Xoá'>
                            <ButtonAnt
                                onClick={() => confirmDelete(record.ID)}
                                type='primary'
                                danger
                                icon={<DeleteOutlined />}
                            />
                        </Tooltip>
                    </Col>
                </Row>
            )
        }
    ];

    return (
        <div css={rootStyles}>
            <DishManagementSearcher onSearch={handleSearch} />

            <div css={boxStyles}>
                <Typography.Title level={5}>Danh sách món ăn</Typography.Title>

                <Table
                    columns={columns}
                    dataSource={dishResponse?.data || []}
                    loading={isLoading}
                    pagination={{
                        showQuickJumper: false,
                        showSizeChanger: true,
                        current: pagination.curPage,
                        pageSize: pagination.limitPage,
                        total: dishResponse?.total || 0,
                        onChange: (offset, pageSize) => {
                            handlePageChange({ offset, pageSize, filter });
                        }
                    }}
                    rowKey="ID"
                />
            </div>
        </div>
    );
}

const rootStyles = css`
  background: var(--gray-soft-color);
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  min-height: calc(100vh - var(--header-height));
`;

const boxStyles = css`
  padding: 1rem;
  background: var(--white-color);
  box-shadow: 0.02rem 0.04rem 0.2rem var(--gray-light-color);
  &:nth-of-type(2) {
    padding: 1.6rem 1rem;
  }

  .ant-table-thead > tr > th {
    background: var(--blue-dark-color) !important;
    color: var(--white-color);
  }

  .ant-table-cell::before {
    display: none;
  }
`;

const editButtonStyles = css`
  background-color: var(--yellow-light-color) !important;
  color: var(--white-color);
`;
