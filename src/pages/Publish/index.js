import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useStore } from '@/store'
import { useEffect, useRef, useState } from 'react'
import { http } from '@/utils'
const { Option } = Select
const Publish = () => {
  const { channelStore } = useStore()

  // 存放上传图片的列表
  const [fileList, setFileList] = useState([])
  // 这个函数的执行分阶段 是从updating到done的过程
  // 这个过程只要上传图片内容发生变化就会不断执行直到全部上传完毕
  // 使用useRef声明一个暂存仓库
  const cacheImgList = useRef([])
  const onUploadChange = ({ fileList }) => {
    // 同时把图片列表存入仓库一份
    // 这里关键位置:需要做数据格式化
    const formatList = fileList.map(file => {
      // 上传完毕 做数据处理
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      // 否则在上传中时，不做处理
      return file
    })
    setFileList(formatList)
    cacheImgList.current = formatList
  }

  // 切换图片
  const [imgCount, setImageCount] = useState(1)
  const radioChange = (e) => {
    // 这里要使用e.target.value做判断
    const rawValue = e.target.value
    setImageCount(rawValue)
    // 无图模式
    if (cacheImgList.current.length === 0) {
      return false
    }
    // 单图模式
    if (rawValue === 1) {
      const img = cacheImgList.current[0]
      setFileList([img])
      // 多图模式
    } else if (rawValue === 3) {
      setFileList(cacheImgList.current)
    }
  }

  // 提交表单
  const navigate = useNavigate()
  const onFinish = async (values) => {
    // 数据的二次处理 重点是处理cover字段
    const { channel_id, content, title, type } = values
    // 判断type fileList 是匹配的才能正常提交
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        // images: fileList.map(item => item.response.data.url)
        images: fileList.map(item => item.url)
      }
    }
    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`, params)
    } else {
      await http.post('/mp/articles?draft=false', params)
    }

    // 跳转列表 提示用户
    navigate('/article')
    message.success(`${id ? 'Update Success' : 'Post Success'}`)
  }

  // 编辑功能
  // 文案适配  路由参数id 判断条件
  const [params] = useSearchParams()
  const id = params.get('id')
  // 数据回填  id调用接口  1.表单回填 2.暂存列表 3.Upload组件fileList
  const [form] = Form.useForm()
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`)
      const data = res.data
      // 表单数据回填
      form.setFieldsValue({ ...data, type: data.cover.type })
      // 回填upload
      const formatImgList = data.cover.images.map(url => ({ url }))
      setFileList(formatImgList)
      // 暂存列表里也存一份
      cacheImgList.current = formatImgList
      // 图片type
      setImageCount(data.cover.type)
    }
    // 必须是编辑状态 才可以发送请求
    if (id) {
      loadDetail()
    }
  }, [id, form])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">Front Page</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? 'Edit' : 'Post'} Article</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: '' }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input title of article' }]}
          >
            <Input placeholder="Please input title of article" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="Channel"
            name="channel_id"
            rules={[{ required: true, message: 'Please select channel of article' }]}
          >
            <Select placeholder="Please select channel of article" style={{ width: 400 }}>
              {channelStore.channelList.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}

            </Select>
          </Form.Item>

          <Form.Item label="Cover">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>Single photo</Radio>
                <Radio value={3}>Triple photo</Radio>
                <Radio value={0}>No photo</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                multiple={imgCount > 1}
                maxCount={imgCount}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}

          </Form.Item>
          {/* 这里的富文本组件 已经被Form.Item控制 */}
          {/* 它的输入内容 会在onFinished回调中收集起来 */}
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please input content of article' }]}
          >
            <ReactQuill theme="snow" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {id ? 'Update' : 'Post'} Article
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)