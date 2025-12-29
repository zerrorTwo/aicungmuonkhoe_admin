/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Form, Input, Button, Card, Typography, message, Spin } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from '../../redux/services/authApi'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../redux/slices/authSlice'
import { LoginDto } from '../../types/api.types'

const { Title } = Typography

export default function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [login, { isLoading }] = useLoginMutation()

    const onFinish = async (values: LoginDto) => {
        try {
            const result = await login(values).unwrap()
            console.log(result);

            if (result.data) {
                const { user, access_token } = result.data

                // Check if user is admin
                if (user.IS_ADMIN !== 1) {
                    message.error('Bạn không có quyền truy cập vào trang này!')
                    return
                }

                dispatch(setCredentials({ user, token: access_token }))
                message.success('Đăng nhập thành công')
                navigate('/health')
            } else {
                message.error(result.message || 'Đăng nhập thất bại')
            }
        } catch (err: any) {
            // Handle error safely
            const errorMsg = err?.data?.message || err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
            if (Array.isArray(errorMsg)) {
                message.error(errorMsg[0]);
            } else {
                message.error(errorMsg);
            }
        }
    }

    return (
        <div css={containerStyle}>
            <Card css={cardStyle}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Title level={2} style={{ color: 'var(--primary-color)', marginBottom: 0 }}>
                        Admin Portal
                    </Title>
                    <Typography.Text type="secondary">Đăng nhập để tiếp tục</Typography.Text>
                </div>

                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    size="large"
                    layout="vertical"
                >
                    <Form.Item
                        name="EMAIL"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Email!' },
                            { type: 'email', message: 'Email không hợp lệ!' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Email"
                        />
                    </Form.Item>

                    <Form.Item
                        name="PASSWORD"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            loading={isLoading}
                            style={{ height: '45px', fontWeight: 600 }}
                        >
                            ĐĂNG NHẬP
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--gray-soft-color) 0%, #e6f7ff 100%);
`

const cardStyle = css`
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: none;
  
  .ant-card-body {
    padding: 2.5rem 2rem;
  }
`
