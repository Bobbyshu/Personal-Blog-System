import { Card, Form, Input, Checkbox, Button, message } from 'antd'
import logo from '@/assets/logo.png'
import './index.scss'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'
function Login () {
  const { loginStore } = useStore()
  const navigate = useNavigate()
  async function onFinish (values) {
    console.log(values)
    const { mobile, code } = values
    await loginStore.getToken({ mobile, code })
    navigate('/', { replace: true })
    message.success('Login Success')
  }
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        <Form
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            remember: true,
            mobile: '13811111111',
            code: '246810'
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="mobile"
            rules={[
              {
                required: true,
                message: 'Please input phone number',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: 'please input valid phone number',
                validateTrigger: 'onBlur'
              }
            ]}
          >
            <Input size="large" placeholder="Please input phone number" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: 'Please input password',
              },
              {
                len: 6,
                message: 'please input 6-digit password',
                validateTrigger: 'onBlur'
              }
            ]}
          >
            <Input size="large" placeholder="please input verification code" />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName='checked'
          >
            <Checkbox className="login-checkbox-label">
              I have read and agree to the User Agreement and Privacy Policy
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login