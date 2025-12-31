/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button, Typography, Space, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DishManagementTable from '@/components/tables/dish/dish-management.table';
import { useQuery } from '@/hooks/query.hook';
import { PageURLs } from '@/utils/navigate';

const { Search } = Input;

export default function DishManagement() {
    const { push } = useQuery();

    const handleCreate = () => {
        push(PageURLs.ofDishManagementCreate());
    };

    return (
        <div css={rootStyles}>
            <div css={headerStyles}>
                <Typography.Title css={titleStyles} level={5}>
                    Quản lý món ăn
                </Typography.Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Thêm món ăn mới
                </Button>
            </div>

            <div css={contentStyles}>
                <DishManagementTable />
            </div>
        </div>
    );
}

const rootStyles = css`
  background: var(--gray-soft-color);
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  padding: 1.4rem 2.4rem 0;
  min-height: calc(100vh - var(--header-height));
`;

const titleStyles = css`
  padding: 1.4rem;
  background: var(--white-color);
  margin-bottom: 0 !important;
  border-radius: 1rem;
`;

const contentStyles = css`
  background: var(--white-color);
  padding: 1.4rem;
  border-radius: 1rem;
  flex: 1;
`;

const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.4rem;
`;
