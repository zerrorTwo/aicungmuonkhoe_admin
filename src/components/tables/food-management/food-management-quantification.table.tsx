import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import {
    App,
    Button as ButtonAnt,
    Col,
    Row,
    Table,
    TableColumnsType,
    Tooltip,
    Typography
} from 'antd';
import { FoodManagementQuantificationModal } from '@/components/modals/food-management/quantification.modal';
import { useModal } from '@/hooks/modal.hook';
import { useCallback } from 'react';
import { PAGINATION_PARAMS } from '@/constants/pagination.constant';
import { useQuery } from '@/hooks/query.hook';
import { PageURLs } from '@/utils/navigate';
import usePermission from '@/hooks/permission.hook';

const IMAGE_DEFAULT = '/assets/images/image_default.png';

type FoodQuantitative = any;
const watchFoodQuantitativePagination = (state: any) => ({ curPage: 1, limitPage: 10, totalRows: 0 });
const watchQuantitationFoodLoading = (state: any) => false;
const getListFoodQuantitative = (params: any) => ({ type: 'MOCK_GET', payload: params });
const useAppDispatch = () => (action: any) => { console.log('Dispatch', action) };
const useAppSelector = (selector: any) => selector({});

type PageChangeParams = {
    page?: number;
    pageSize?: number;
};

export const FoodQuantificationTable = ({
    nameFood,
    setListFoodQuantitative,
    listFoodQuantitative,
    getFoodId,
    btnIdFood
}: {
    nameFood: string;
    setListFoodQuantitative: React.Dispatch<React.SetStateAction<FoodQuantitative[]>>;
    listFoodQuantitative: FoodQuantitative[];
    getFoodId: () => string;
    btnIdFood: boolean
}) => {
    const { openModal, closeModal } = useModal();
    const dispatch = useAppDispatch();
    const { push } = useQuery();
    const { modal } = App.useApp();
    const pagination = useAppSelector(watchFoodQuantitativePagination);
    const loading = useAppSelector(watchQuantitationFoodLoading);
    const { creatable, updatable, deletable, importable } = usePermission();

    const PermissionMode = {
        QUANTIFICATION: 'QUANTIFICATION'
    };

    const handleOpenModal = () => {
        openModal(<FoodManagementQuantificationModal
            onCancel={closeModal}
            nameFood={nameFood}
            setListFoodQuantitative={setListFoodQuantitative}
            foodId={getFoodId()}
        />);
    };

    const handlePageChange = useCallback(
        ({
            page = PAGINATION_PARAMS.offset,
            pageSize = PAGINATION_PARAMS.limit
        }: PageChangeParams) => {
            dispatch(getListFoodQuantitative({ offset: page, limit: pageSize }));
        },
        [dispatch]
    );

    const handleDeleteQuantitation = (quantitation: any) => {
        const updatedList = listFoodQuantitative.filter(item => item.id !== quantitation.id);
        setListFoodQuantitative(updatedList);
    };

    const onAddQuantificationByGroup = () => {
        push(
            `${PageURLs.ofFoodManagement()}?mode=${PermissionMode.QUANTIFICATION}`
        );
    };

    const confirmDeleteQuantitationFood = (quantitation: any) => {
        modal.confirm({
            title: 'Bạn có chắc chắn định lượng thực phẩm này?',
            content: (
                <em>
                    Dữ liệu không thể khôi phục
                </em>
            ),
            okText: 'Xóa',
            width: 450,
            cancelText: 'Hủy',
            onOk: () => handleDeleteQuantitation(quantitation)
        });
    };

    const columns: TableColumnsType<FoodQuantitative> = [
        {
            title: 'STT',
            render: (_, __, index) => (pagination.curPage - 1) * pagination.limitPage + index + 1,
        },
        {
            title: 'ID định lượng thực phẩm',
            dataIndex: 'id',
            key: 'id',
            width: 200,
            render: (text, record) => record.idDisplay || text
        },
        {
            title: 'Thumbnail thực phẩm sống',
            dataIndex: 'image',
            key: 'image',
            render: (record) => (
                <img
                    src={record ? `${record}` : IMAGE_DEFAULT}
                    alt='Raw Thumbnail'
                    style={{ width: '50px', height: '32px', objectFit: 'cover' }}
                />
            ),
            align: 'center'
        },
        {
            title: 'Thumbnail thực phẩm chín',
            dataIndex: 'imageCooked',
            key: 'imageCooked',
            render: (record) => (
                <img
                    src={record ? `${record}` : IMAGE_DEFAULT}
                    alt='Cooked Thumbnail'
                    style={{ width: '50px', height: '32px', objectFit: 'cover' }}
                />
            ),
            align: 'center'
        },
        {
            title: 'Khối lượng thực phẩm sống',
            dataIndex: 'mass',
            key: 'mass',
            render: (mass, record) => `${mass}${record.unit}`,
            width: 200,
            align: 'center'
        },
        {
            title: 'Khối lượng thực phẩm chín',
            dataIndex: 'quantitative',
            key: 'quantitative',
            render: (quantitative, record) => `${quantitative}${record.unitQuantitative}`,
            width: 200,
            align: 'center'
        },
        {
            title: 'Thao tác',
            key: 'action',
            fixed: 'right',
            width: 104,
            render: (record) => (
                <Row gutter={[8, 10]}>
                    {updatable && (
                        <Col>
                            <Tooltip title='Cập nhật'>
                                <ButtonAnt
                                    icon={<EditOutlined />}
                                    css={updateButtonStyles}
                                    onClick={() => {
                                        openModal(
                                            <FoodManagementQuantificationModal
                                                onCancel={closeModal}
                                                nameFood={nameFood}
                                                mode="edit"
                                                defaultValues={record}
                                                setListFoodQuantitative={setListFoodQuantitative}
                                                foodId={getFoodId()}
                                            />
                                        );
                                    }}
                                />
                            </Tooltip>
                        </Col>
                    )}
                    {deletable && (
                        <Col>
                            <Tooltip title='Xoá'>
                                <ButtonAnt
                                    onClick={() => confirmDeleteQuantitationFood(record)}
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
        <div css={containerStyles}>
            <Row align='middle' justify='space-between'>
                <Col>
                    <Typography>Thông tin định lượng thực phẩm</Typography>
                </Col>
                <Col>
                    <Row justify='space-between' css={{ gap: '10px' }}>
                        {creatable && (
                            <ButtonAnt
                                icon={<PlusOutlined />}
                                iconPosition='start'
                                css={btnIdFood ? selfInputButtonStyles : ''}
                                onClick={handleOpenModal}
                                disabled={!btnIdFood}
                            >
                                Tự nhập định lượng của thực phẩm
                            </ButtonAnt>
                        )}
                        {importable && (
                            <ButtonAnt onClick={onAddQuantificationByGroup} css={listInputButtonStyles}>
                                Nhập định lượng thực phẩm theo danh sách
                            </ButtonAnt>
                        )}
                    </Row>
                </Col>
            </Row>

            <Table<FoodQuantitative>
                columns={columns}
                dataSource={listFoodQuantitative}
                css={tableStyles}
                loading={loading}
                pagination={{
                    showQuickJumper: true,
                    showSizeChanger: true,
                    // current: pagination.curPage,
                    // pageSize: pagination.limitPage,
                    total: pagination.totalRows,
                    onChange: (page, pageSize) => {
                        handlePageChange({ page, pageSize });
                    }
                }}
            />
        </div>
    );
}

const containerStyles = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const selfInputButtonStyles = css`
  color: var(--blue-light-color);
  border-color: var(--blue-light-color);

  &:hover {
    background-color: var(--white-color) !important;
    color: var(--blue-light-color) !important;
    border-color: var(--blue-light-color) !important;
  }
`;

const listInputButtonStyles = css`
  background-color: var(--white-color);
  color: var(--success-color);
  border-color: var(--success-color);

  &:hover {
    background-color: var(--white-color) !important;
    color: var(--success-color) !important;
    border-color: var(--success-color) !important;
  }
`;

const tableStyles = css`
  .ant-table-thead > tr > th {
    background: var(--blue-dark-color) !important;
    color: var(--white-color) !important;
  }

  .ant-table-cell::before {
    display: none;
  }
`;

const updateButtonStyles = css`
  background-color: var(--yellow-light-color) !important;
  color: var(--white-color) !important;

  &:hover {
    border-color: var(--yellow-light-color) !important;
  }
`;
