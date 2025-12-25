/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Layout, Typography } from 'antd';

import { useState } from 'react';
import { useQuery } from '@/hooks/query.hook';
import { ConclusionRecommendationMenu } from '@/components/list/conclusion-recommendation.list';
import { CONCLUSION_RECOMMENDATION } from '@/constants/conclusion-recommendation';
import { ConclusionRecommendationKey } from '@/enums/conclusion-recommendation-key';
import { ConclusionRecommendationForm } from '@/components/forms/conclusion-recommendation';

const { Content, Sider } = Layout;

export default function HealthManagement() {
    const { getParam } = useQuery();
    const conclusionRecommendationKey = getParam('conclusionRecommendationKey');

    const [selectedMenuKey, setSelectedMenuKey] = useState<string>(
        conclusionRecommendationKey || ConclusionRecommendationKey.BloodPressureClinic
    );

    const handleSelectMenuItem = (key: string) => {
        setSelectedMenuKey(key);
    };

    return (
        <div css={rootStyles}>
            <Typography.Title css={titleStyles} level={5}>
                Quản lý kết luận & khuyến nghị
            </Typography.Title>
            <Layout>
                <Sider width={300} theme='light'>
                    <ConclusionRecommendationMenu
                        onSelectMenuItem={handleSelectMenuItem}
                    />
                </Sider>
                <Layout>
                    <Content>
                        <Typography.Title css={titleContentStyles} level={5}>
                            {selectedMenuKey
                                ? CONCLUSION_RECOMMENDATION[selectedMenuKey]
                                : CONCLUSION_RECOMMENDATION[
                                ConclusionRecommendationKey.BloodPressureClinic
                                ]}
                        </Typography.Title>
                        <ConclusionRecommendationForm selectedKey={selectedMenuKey} />
                    </Content>
                </Layout>
            </Layout>
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

const titleContentStyles = css`
  margin: 0 0 1.4rem 1.4rem !important;
  padding: 1.4rem;
  background: var(--white-color);
  border-radius: 1rem;
`;
