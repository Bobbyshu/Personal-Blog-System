import { Link, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Table, Tag, Space, Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useEffect, useState } from 'react'
import { http } from '@/utils'
import { useStore } from '@/store'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const { channelStore } = useStore()


  const onFinish = (values) => {
    console.log(values)
    const { channel_id, date, status } = values
    const _params = {}
    if (status !== -1) {
      _params.status = status
    }
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    setParams({
      ...params,
      ..._params
    })
  }

  const [articleData, setArticleData] = useState({
    list: [],
    count: 0
  })

  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    status: 0
  })

  useEffect(() => {
    const loadList = async () => {
      const res = http.get('/mp/articles', { params })
      console.log(res)
      const { results, total_count } = res.data
      setArticleData({
        list: results,
        count: total_count
      })
    }
    loadList()
  }, [params])

  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  const delArticle = async (data) => {
    console.log(data)
    await http.delete(`/mp/articles/${data.id}`)
    setParams({
      ...params,
      page: 1
    })
  }

  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }
  const columns = [
    {
      title: 'Cover',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover || img404} width={200} height={150} alt="" />
      }
    },
    {
      title: 'Title',
      dataIndex: 'title',
      width: 220
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: data => <Tag color="green">Review passed</Tag>
    },
    {
      title: 'Publish',
      dataIndex: 'pubdate'
    },
    {
      title: 'Read',
      dataIndex: 'read_count'
    },
    {
      title: 'comment',
      dataIndex: 'comment_count'
    },
    {
      title: 'like',
      dataIndex: 'like_count'
    },
    {
      title: 'Operation',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => goPublish(data)} />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => delArticle(data)}
            />
          </Space>
        )
      }
    }
  ]
  return (
    <div>
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">front page</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Content management</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form
          onFinish={onFinish}
          initialValues={{ status: -1 }}>
          <Form.Item label="Stauts" name="status">
            <Radio.Group>
              <Radio value={-1}>All</Radio>
              <Radio value={0}>Draft</Radio>
              <Radio value={1}>Pending</Radio>
              <Radio value={2}>Review passed</Radio>
              <Radio value={3}>Review failed</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Channel" name="channel_id">
            <Select
              placeholder="Please select the article channel"
              style={{ width: 120 }}
            >
              {channelStore.channelList.map(channel => <Option key={channel.id} value={channel.id}>{channel.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="Date" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              Filter
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title={`According to the filter conditions, a total of ${articleData.count} results are found:`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={articleData.list}
          pagination={{
            pageSize: params.per_page,
            total: articleData.count,
            onChange: pageChange
          }
          }
        />
      </Card>
    </div>
  )
}

export default observer(Article)