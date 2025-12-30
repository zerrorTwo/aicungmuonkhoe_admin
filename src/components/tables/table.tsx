/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button, Col, Row, Table as TableAnt, Typography } from 'antd';
import type { TableColumnsType, TableProps as TablePropsAnt } from 'antd';
import { createStyles } from 'antd-style';
import { ReloadOutlined } from '@ant-design/icons';
import { Search, SearchProps } from '@/components/search';

const { Text } = Typography;

const useStyle = createStyles(({ css }) => {
    const antCls = '.ant';
    return {
        customTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: unset;
          }
        }
      }
    `,
        stickyTable: css`
      ${antCls}-table {
        ${antCls}-table-container {
          ${antCls}-table-body,
          ${antCls}-table-content {
            scrollbar-width: thin;
            scrollbar-color: unset;
          }
        }
        ${antCls}-table-thead > tr > th {
          position: sticky !important;
          top: 0 !important;
          z-index: 50 !important;
          background: inherit !important;
        }
      }
    `
    };
});

interface TableProps<T> {
    columns: TableColumnsType<T>;
    dataSource: T[];
    scrollY?: number;
    totalResult?: number;
    loading?: boolean;
    onReset?: () => void;
    enableSticky?: boolean;
    stickyOffsetHeader?: number;
}

export const Table = <T extends object>({
    columns,
    dataSource,
    scrollY,
    totalResult,
    placeholder,
    onFilter,
    onReset,
    locale,
    enableSticky = false,
    stickyOffsetHeader = 0,
    ...props
}: TablePropsAnt<T> & TableProps<T> & SearchProps) => {
    const { styles } = useStyle();

    const { loading, pagination, rowKey, expandable } = props;

    const isTableTop = !!totalResult || !!onFilter || !!onReset;

    return (
        <div css={tableWrapperStyles}>
            {isTableTop && (
                <Row
                    className='table-top'
                    justify='space-between'
                    align='middle'
                    gutter={[16, 16]}
                >
                    <Col span={8}>
                        {!!totalResult && (
                            <Text>
                                <strong>Tổng số: </strong>
                                {totalResult} Kết quả
                            </Text>
                        )}
                    </Col>
                    <Col span={16} flex={1}>
                        <Row gutter={[8, 0]} align='middle'>
                            {onFilter && (
                                <Col flex={1}>
                                    <Search placeholder={placeholder ?? ''} onFilter={onFilter} />
                                </Col>
                            )}
                            {onReset && (
                                <Col>
                                    <Button
                                        type='text'
                                        css={searchBtnStyles}
                                        onClick={onReset}
                                        color='default'
                                        icon={<ReloadOutlined />}
                                    />
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            )}
            <TableAnt<T>
                rowKey={rowKey}
                className={styles.customTable}
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                pagination={pagination}
                expandable={expandable}
                scroll={{
                    x: 'max-content',
                    y: enableSticky ? undefined : scrollY
                }}
                sticky={enableSticky ? {
                    offsetHeader: stickyOffsetHeader,
                } : undefined}
                locale={locale}
            />
        </div>
    );
};

const tableWrapperStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const searchBtnStyles = css`
  border: none;
  box-shadow: none;
  width: 2.6rem !important;
  height: 2.6rem !important;
  &:hover {
    border-radius: 50%;
    opacity: 0.85;
  }
`;
