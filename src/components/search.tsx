/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { GetProps, Input } from 'antd';

const { Search: SearchAnt } = Input;

export type SearchProps = GetProps<typeof SearchAnt> & {
    placeholder?: string;
    onFilter?: (values: any) => void;
};

export const Search = ({ placeholder, onFilter }: SearchProps) => {
    const onSearch: SearchProps['onSearch'] = (value, _e) => {
        if (onFilter) {
            onFilter({
                textSearch: value
            });
        }
    };

    return (
        <div css={searchWrapperStyles}>
            <SearchAnt
                css={searchStyles}
                allowClear
                placeholder={placeholder}
                onSearch={onSearch}
            />
        </div>
    );
};

const searchWrapperStyles = css`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const searchStyles = css`
  max-width: 45rem;
  width: 100%;
`;
