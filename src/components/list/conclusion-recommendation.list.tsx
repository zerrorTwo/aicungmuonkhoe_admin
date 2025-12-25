import { ConclusionRecommendationKey } from '@/enums/conclusion-recommendation-key'
import { useQuery } from '@/hooks/query.hook'
import { Menu } from 'antd'
import type { MenuClickEventHandler } from 'rc-menu/lib/interface'
import { useState } from 'react'

type ConclusionRecommendationMenuProps = {
    onSelectMenuItem: (key: string) => void
}

export const ConclusionRecommendationMenu = ({
    onSelectMenuItem
}: ConclusionRecommendationMenuProps) => {
    const { push, getParam } = useQuery()
    const conclusionRecommendationKey = getParam('conclusionRecommendationKey')

    const [openKeys, setOpenKeys] = useState<string[]>([
        conclusionRecommendationKey?.substring(0, 1) ??
        ConclusionRecommendationKey.BloodPressure
    ])

    const handleClick: MenuClickEventHandler = (e) => {
        onSelectMenuItem(e.key)

        push(`${location.pathname}?conclusionRecommendationKey=${e.key}`)
    }

    const handleOpenChange = (keys: string[]) => {
        const latestOpenKey = keys.find((key) => !openKeys.includes(key)) || ''
        setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }

    const items = [
        {
            key: ConclusionRecommendationKey.BloodPressure,
            label: 'Huyết áp',
            children: [
                {
                    key: ConclusionRecommendationKey.BloodPressureClinic,
                    label: 'Đo tại cơ sở y tế'
                },
                {
                    key: ConclusionRecommendationKey.BloodPressureHome,
                    label: 'Đo tại nhà'
                }
            ]
        },
        {
            key: ConclusionRecommendationKey.BloodSugar,
            label: 'Đường huyết',
            children: [
                {
                    key: ConclusionRecommendationKey.BloodSugarFasting,
                    label: 'Đường huyết khi đói'
                },
                {
                    key: ConclusionRecommendationKey.BloodSugar2H,
                    label: 'Đường huyết sau 2 giờ uống'
                },
                { key: ConclusionRecommendationKey.BloodSugarHbA1c, label: 'HbA1c' }
            ]
        },
        {
            key: ConclusionRecommendationKey.LiverEnzyme,
            label: 'Chức năng gan',
            children: [
                { key: ConclusionRecommendationKey.LiverEnzymeSgpt, label: 'SGPT/ ALT' },
                {
                    key: ConclusionRecommendationKey.LiverEnzymeSgot,
                    label: 'SGOT/ AST'
                }

            ]
        },
        {
            key: ConclusionRecommendationKey.Lipid,
            label: 'Mỡ máu',
            children: [
                {
                    key: ConclusionRecommendationKey.LipidCholesterol,
                    label: 'Cholesterol'
                },
                { key: ConclusionRecommendationKey.LipidLdl, label: 'LDL' },
                { key: ConclusionRecommendationKey.LipidHdl, label: 'HDL' },
                {
                    key: ConclusionRecommendationKey.LipidTriglyceride,
                    label: 'Triglyceride'
                }
            ]
        },
        {
            key: ConclusionRecommendationKey.UreaCreatinine,
            label: 'Chức năng thận',
            children: [
                { key: ConclusionRecommendationKey.Urea, label: 'Urea' },
                { key: ConclusionRecommendationKey.Creatinine, label: 'Creatine' }
            ]
        },
        {
            key: ConclusionRecommendationKey.UricAcid,
            label: 'Axit Uric'
        },
        {
            key: ConclusionRecommendationKey.BMI,
            label: 'BMI'
        },
        {
            key: ConclusionRecommendationKey.HeightWeightUnder5,
            label: 'Chiều cao, Cân nặng (0 - 5 tuổi)',
            children: [
                { key: ConclusionRecommendationKey.Weight, label: 'Cân nặng' },
                {
                    key: ConclusionRecommendationKey.HeightLength,
                    label: 'Chiều dài/ Chiều cao'
                },
            ]
        },

    ]

    return (
        <Menu
            mode='inline'
            defaultSelectedKeys={[ConclusionRecommendationKey.BloodPressure]}
            selectedKeys={[
                conclusionRecommendationKey ||
                ConclusionRecommendationKey.BloodPressureClinic
            ]}
            onClick={handleClick}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            items={items}
        />
    )
}
