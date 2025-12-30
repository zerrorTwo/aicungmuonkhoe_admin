import { css } from '@emotion/react';

interface CustomLabelProps {
    text: string;
    isRequired?: boolean;
}

const CustomLabel = ({ text, isRequired = false }: CustomLabelProps) => {
    return (
        <span css={customLabelStyles}>
            {text}
            {isRequired && <span css={asteriskStyles}>*</span>}
        </span>
    );
};

export default CustomLabel;

const customLabelStyles = css`
    font-family: Roboto !important;
    font-weight: 400 !important;
    font-size: 14px !important;
    line-height: 22px !important;
    color: #000000 !important;
`;

const asteriskStyles = css`
  color: #FF4345; 
  margin-left: 4px;  
`;
