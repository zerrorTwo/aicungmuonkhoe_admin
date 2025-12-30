/** @jsxImportSource @emotion/react */
import {
    Col,
    Row,
    TableColumnsType,
    Tooltip,
    Button as ButtonAnt,
    Modal,
    Typography,
    App,
    notification
} from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
const IMAGE_DEFAULT = '/assets/images/image_default.png';
import { Table } from '@/components/tables/table';
import { css } from '@emotion/react';
import FOOD_NUTRIENTS, { FoodNutrient } from '@/constants/food-nutrients.constant';
import { useCallback, useEffect, useState } from 'react';
// import { FoodManagementNutrientDetails } from '@/components/forms/food-management/nutrients.form';
import { FoodManagementSearcher } from '@/components/forms/food-management/searcher.form';
import { useModal } from '@/hooks/modal.hook';
import { FoodManagementInformationModal } from '@/components/modals/food-management/information.modal';
import { PAGINATION_PARAMS } from '@/constants/pagination.constant';
import dayjs from 'dayjs';
import { useQuery } from '@/hooks/query.hook';
import { formatDateToHHmmDDMMYYYY } from '@/utils/common';
import usePermission from '@/hooks/permission.hook';
import { useGetFoodsQuery, useDeleteFoodMutation, useGetMaterialGroupsQuery } from '@/redux/services/foodApi';
import { FoodManagementNutrientDetails } from '@/components/forms/food-management/nutrients.form';

type PageChangeParams = {
    offset?: number;
    pageSize?: number;
    filter?: any;
};

export default function FoodSingleManagementTable() {
    const [selected, setSelected] = useState(undefined);
    const { openModal, closeModal } = useModal();
    const [filter, setFilter] = useState<any>({});
    const [pagination, setPagination] = useState({
        curPage: 1,
        limitPage: 10,
    });

    const { data: listNutritionGroup = [] } = useGetMaterialGroupsQuery();

    const { data: foodData, isLoading } = useGetFoodsQuery({
        page: pagination.curPage,
        limit: pagination.limitPage,
        ...filter,
    });

    const [deleteFood] = useDeleteFoodMutation();

    const { push } = useQuery();
    const { updatable, deletable } = usePermission();

    const PageURLs = { ofFoodManagement: () => '/food-v1' }
    const PermissionMode = { EDIT: 'EDIT' }

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
            if (values.name) newFilter.search = values.name;
            if (values.materialGroup) newFilter.group_material = values.materialGroup;
        }

        setFilter(newFilter);
        setPagination(prev => ({ ...prev, curPage: 1 }));
    };

    const handleViewInformation = (food: any) => {
        // Assuming FoodManagementInformationModal needs full food object.
        // Wait, the API returns full object in list? Yes.
        // Or do we need to fetch detail? The list has basics.
        // Let's pass record.
        openModal(
            <FoodManagementInformationModal
                food={food}
                onCancel={closeModal}
            />, { width: 1200 }
        );
    };

    const handleEditInformation = (food: any) => {
        push(
            `${PageURLs.ofFoodManagement()}?mode=${PermissionMode.EDIT}&foodId=${food.ID}`
        );
    };

    const handleDeleteFood = async (foodId: string) => {
        try {
            await deleteFood(foodId).unwrap();
            notification.success({ message: 'Xoá thực phẩm thành công' });
        } catch (error) {
            notification.error({ message: 'Xoá thực phẩm thất bại' });
        }
    };

    const confirmDeleteFood = (foodId: string) => {
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
            onOk: () => handleDeleteFood(foodId)
        });
    };

    const nutrientColumns: TableColumnsType<any> = Object.keys(
        FOOD_NUTRIENTS
    ).map((key, _) => ({
        title: FOOD_NUTRIENTS[key].title,
        dataIndex: key,
        key,
        width: 'auto',
        render: (_, record) =>
            record[FOOD_NUTRIENTS[key]?.name] &&
            record[FOOD_NUTRIENTS[key]?.name] + FOOD_NUTRIENTS[key]?.unit
    }));

    const columns: TableColumnsType<any> = [
        {
            title: 'STT',
            render: (_, __, index) => (pagination.curPage - 1) * pagination.limitPage + index + 1,
            width: 60,
        },
        {
            title: 'ID thực phẩm',
            dataIndex: 'ID',
            key: 'ID',
            width: 100,
        },
        {
            title: 'Tên thực phẩm',
            dataIndex: 'NAME',
            key: 'NAME',
            width: 200,
            fixed: 'left'
        },

        {
            title: 'Hình Thumbnail',
            dataIndex: 'IMAGE',
            key: 'IMAGE',
            render: (record) => (
                <img
                    src={record ? `${record}` : IMAGE_DEFAULT}
                    alt='Food Thumbnail'
                    style={{ width: '50px', height: '32px', objectFit: 'cover' }}
                />
            )
        },
        {
            title: 'Phân loại thực phẩm theo nhóm nguyên liệu',
            dataIndex: 'GROUP_MATERIAL',
            key: 'GROUP_MATERIAL',
            width: 200,
            render: (value: string) => {
                const group = listNutritionGroup.find((item: any) => item.CODE === value);
                return group ? group.NAME : value;
            }
        },
        ...(nutrientColumns as TableColumnsType<FoodNutrient>),
        {
            title: 'Cập nhật mới nhất',
            dataIndex: 'MODIFIED_DATE',
            key: 'MODIFIED_DATE',
            width: 150,
            render: (_, record) => record.MODIFIED_DATE ? `${formatDateToHHmmDDMMYYYY(record.MODIFIED_DATE)}` : '',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'CREATED_DATE',
            key: 'CREATED_DATE',
            width: 150,
            render: (_, record) => record.CREATED_DATE ? `${formatDateToHHmmDDMMYYYY(record.CREATED_DATE)}` : '',
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 104,
            render: (_, record) => (
                <Row gutter={4} wrap={false}>
                    <Col>
                        <Tooltip title='Xem thông tin'>
                            <ButtonAnt
                                onClick={() => handleViewInformation(record)}
                                type='primary'
                                icon={<EyeOutlined />}
                                css={viewButtonStyles}
                            />
                        </Tooltip>
                    </Col>
                    {updatable && (
                        <Col>
                            <Tooltip title='Cập nhật'>
                                <ButtonAnt
                                    onClick={() => handleEditInformation(record)}
                                    type='primary'
                                    icon={<EditOutlined />}
                                    css={editButtonStyles}
                                />
                            </Tooltip>
                        </Col>
                    )}
                    {deletable && (
                        <Col>
                            <Tooltip title='Xoá'>
                                <ButtonAnt
                                    onClick={() => confirmDeleteFood(record.ID)}
                                    type='primary'
                                    danger
                                    icon={<DeleteOutlined />}
                                />
                            </Tooltip>
                        </Col>
                    )}
                </Row>
            )
        }
    ];
    return (
        <div css={rootStyles}>
            <FoodManagementSearcher onSearch={handleSearch} />

            <div css={boxStyles}>
                <Typography.Title level={5}>Danh sách thực phẩm</Typography.Title>

                <Table<any>
                    columns={columns}
                    dataSource={foodData?.data || []}
                    loading={isLoading}
                    pagination={{
                        showQuickJumper: false,
                        showSizeChanger: true,
                        current: pagination.curPage,
                        pageSize: pagination.limitPage,
                        total: foodData?.total || 0,
                        onChange: (offset, pageSize) => {
                            handlePageChange({ offset, pageSize, filter });
                        }
                    }}
                />

                <Modal
                    open={!!selected}
                    onCancel={(e) => {
                        e.stopPropagation();
                        setSelected(undefined);
                    }}
                    width={1000}
                    footer={null}
                >
                    {/* This modal isn't fully wired yet? Logic was selected. Let's fix handleViewInformation logic if needed. Ah, handleView uses useModal. This internal Modal was for NutrientDetails? The original code had it. I'll leave it but maybe it's redundant if useModal is used.*/}
                    <FoodManagementNutrientDetails food={selected} />
                </Modal>
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

const viewButtonStyles = css`
  background-color: var(--green-dark-color) !important;
  color: var(--white-color);
`;

const editButtonStyles = css`
  background-color: var(--yellow-light-color) !important;
  color: var(--white-color);
`;
