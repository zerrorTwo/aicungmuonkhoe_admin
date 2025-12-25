/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Space, Badge } from 'antd'
import type { MenuProps } from 'antd'
import {
    HeartOutlined,
    BellOutlined,
    UserOutlined,
    CoffeeOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    SettingOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem
}

const healthIndicatorItems: MenuItem[] = [
    getItem('Huyết áp', 'blood-pressure', null, [
        getItem('Đo tại cơ sở y tế', 'bp-medical'),
        getItem('Đo tại nhà', 'bp-home'),
    ]),
    getItem('Đường huyết', 'blood-sugar', null, [
        getItem('Đường huyết khi đói', 'bs-fasting'),
        getItem('Đường huyết sau 2 giờ uống', 'bs-2h'),
        getItem('HbA1c', 'hba1c'),
    ]),
    getItem('Chức năng gan', 'liver', null, [
        getItem('SGPT/ ALT', 'sgpt'),
        getItem('SGOT/ AST', 'sgot'),
    ]),
    getItem('Mỡ máu', 'blood-fat'),
    getItem('Chức năng thận', 'kidney', null, [
        getItem('Urea', 'urea'),
        getItem('Creatine', 'creatine'),
    ]),
    getItem('Axit Uric', 'uric-acid'),
    getItem('BMI', 'bmi'),
    getItem('Chiều cao, Cân nặng (0-5 tuổi)', 'height-weight', null, [
        getItem('Cân nặng', 'weight'),
        getItem('Chiều dài/ Chiều cao', 'height'),
        getItem('Cân nặng theo chiều dài/ chiều cao', 'weight-by-height'),
    ]),
]

const menuItems: MenuItem[] = [
    getItem('Quản lý chỉ số sức khỏe', 'health', <HeartOutlined />),
    getItem('Quản lý thông báo', 'notifications', <BellOutlined />),
    getItem('Quản lý người dùng', 'users', <UserOutlined />),
    getItem('Quản lý món ăn', 'food', <CoffeeOutlined />),
    getItem('Quản lý trang chủ', 'homepage', <HomeOutlined />),
]

const userMenuItems: MenuProps['items'] = [
    {
        key: 'settings',
        icon: <SettingOutlined />,
        label: 'Cài đặt',
    },
    {
        type: 'divider',
    },
    {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Đăng xuất',
    },
]

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const currentPath = location.pathname.split('/')[1] || 'health'

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        navigate(`/${e.key}`)
    }

    return (
        <Layout css={rootStyles}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={280}
                css={siderStyles}
            >
                <div css={logoStyles(collapsed)}>
                    <HeartOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    {!collapsed && (
                        <span css={logoTextStyles}>
                            Health Admin
                        </span>
                    )}
                </div>
                <Menu
                    mode="inline"
                    selectedKeys={[currentPath]}
                    defaultOpenKeys={['health']}
                    items={menuItems}
                    onClick={handleMenuClick}
                    css={menuStyles}
                />
            </Sider>
            <Layout css={contentLayoutStyles(collapsed)}>
                <Header css={headerStyles}>
                    <div
                        onClick={() => setCollapsed(!collapsed)}
                        css={triggerStyles}
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </div>
                    <Space size={24}>
                        <Badge count={5} size="small">
                            <BellOutlined css={iconStyles} />
                        </Badge>
                        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                            <Space css={userSpaceStyles}>
                                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                                <span>Admin</span>
                            </Space>
                        </Dropdown>
                    </Space>
                </Header>
                <Content css={contentStyles}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

const rootStyles = css`
  min-height: 100vh;
`

const siderStyles = css`
  background: var(--white-color);
  border-right: 1px solid #f0f0f0;
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
`

const logoStyles = (collapsed: boolean) => css`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: ${collapsed ? 'center' : 'flex-start'};
  padding: ${collapsed ? 0 : '0 24px'};
  border-bottom: 1px solid #f0f0f0;
`

const logoTextStyles = css`
  margin-left: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
`

const menuStyles = css`
  border-right: 0;
  padding-top: 8px;
`

const contentLayoutStyles = (collapsed: boolean) => css`
  margin-left: ${collapsed ? 80 : 280}px;
  transition: all 0.2s;
`

const headerStyles = css`
  padding: 0 24px;
  background: var(--white-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 1;
`

const triggerStyles = css`
  cursor: pointer;
  font-size: 18px;
`

const iconStyles = css`
  font-size: 18px;
  cursor: pointer;
`

const userSpaceStyles = css`
  cursor: pointer;
`

const contentStyles = css`
  margin: 24px;
  padding: 24px;
  background: var(--white-color);
  border-radius: 8px;
  min-height: calc(100vh - 112px);
`
