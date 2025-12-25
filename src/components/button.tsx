/** @jsxImportSource @emotion/react */
import { Button as ButtonAnt, ButtonProps } from 'antd';

export function Button(props: ButtonProps) {
    return (
        <ButtonAnt {...props}>
            {props.children}
        </ButtonAnt>
    );
}
