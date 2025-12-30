/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Col, Row, Typography } from 'antd';
import { useState } from 'react';
import { Button } from '@/components/button';
import { PlusOutlined } from '@ant-design/icons';
import FoodSingleManagementTable from '@/components/tables/food-management/food-management-single.table';
import { useQuery } from '@/hooks/query.hook';
import usePermission from '@/hooks/permission.hook';
import FoodManagementCreateForm from '@/components/forms/food-management/create.form';
// import { FoodManagementSearcher } from '@/components/forms/food-management/searcher.form'; // This is a filter now, not a page.

import FoodQuantificationByGroupTable from '@/components/tables/food-management/quantification-by-group.table';

export default function FoodManagement() {
  const { creatable, importable } = usePermission();
  const { push, getSearchParam } = useQuery();
  const mode = getSearchParam('mode');

  // Mocked Mode Enums for UI
  const PermissionMode = {
    CREATE: 'CREATE',
    CREATE_BY_LIST: 'CREATE_BY_LIST',
    QUANTIFICATION: 'QUANTIFICATION',
    EDIT: 'EDIT'
  };

  const PageURLs = {
    ofFoodManagement: () => '/food-v1'
  }



  const isCreateOrEdit = [
    PermissionMode.CREATE,
    PermissionMode.CREATE_BY_LIST,
    PermissionMode.QUANTIFICATION,
    PermissionMode.EDIT
  ].includes(mode || '');

  const onAdd = () => {
    push(
      `${PageURLs.ofFoodManagement()}?mode=${PermissionMode.CREATE}`
    );
  };

  const onAddByGroup = () => {
    push(
      `${PageURLs.ofFoodManagement()}?mode=${PermissionMode.CREATE_BY_LIST}`
    );
  };

  return (
    <div css={rootStyles}>
      {!isCreateOrEdit && (
        <>
          <Row css={boxStyles} justify="space-between" align="middle">
            <Col>
              <Typography.Title css={titleStyles} level={5}>
                Quản lý thực phẩm
              </Typography.Title>
            </Col>
            <Col>
              <Row justify="space-between" css={{ gap: '10px' }}>
                {creatable && (
                  <Button
                    icon={<PlusOutlined />}
                    iconPosition="start"
                    onClick={onAdd}
                    css={selfInputButtonStyles}
                  >
                    Tự nhập giá trị dinh dưỡng của từng loại thực phẩm
                  </Button>
                )}
                {importable && (
                  <Button
                    onClick={onAddByGroup}
                    css={listInputButtonStyles}
                  >
                    Nhập giá trị dinh dưỡng của thực phẩm theo danh sách
                  </Button>
                )}
              </Row>
            </Col>
          </Row>
        </>
      )}

      <div css={contentStyles}>
        {!isCreateOrEdit && <FoodSingleManagementTable />}
        {(mode === PermissionMode.CREATE || mode === PermissionMode.EDIT) && <FoodManagementCreateForm />}
        {mode === PermissionMode.CREATE_BY_LIST && <FoodQuantificationByGroupTable />}
      </div>
    </div>
  );
}

const rootStyles = css`
  background: var(--gray-soft-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.4rem 2.4rem;
  min-height: calc(100vh - var(--header-height));
`;

const contentStyles = css`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const tabStyle = css`
  .ant-tabs-nav {
    margin-bottom: 0;
  }

  .ant-tabs-tab {
    padding: 6px 8px;
    color: #333;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
  }

  .ant-tabs-tab:not(:first-of-type) {
    margin: 0 0 0 8px !important;
  }

  .ant-tabs-tab-active {
    background-color: var(--blue-dark-color);
    border: 1px solid var(--blue-dark-color);
    .ant-tabs-tab-btn {
      color: #ffffff !important;
    }
  }

  .ant-tabs-ink-bar {
    display: none;
  }

  .ant-tabs-tab:hover {
    color: #333 !important;
  }
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

const titleStyles = css`
  margin-bottom: 0 !important;
  line-height: 3.2rem !important;
`;

const selfInputButtonStyles = css`

  &:hover {
    background-color: var(--white-color) !important;
  }
`;

const listInputButtonStyles = css`
  background-color: var(--success-color);
  color: var(--white-color);
  border-color: var(--success-color);

  &:hover {
    background-color: var(--success-color) !important;
    border-color: var(--success-color) !important;
    background-color: var(--success-color) !important;
  }
`;


