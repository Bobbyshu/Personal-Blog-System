import './index.scss'
import Bar from '@/components/Bar'

const Home = () => {
  return (
    <div>
      {/* 渲染Bar组件 */}
      <Bar
        title='Mainstream framework satisfaction'
        xData={['angular', 'vue', 'react']}
        yData={[30, 40, 50]}
        style={{ width: '500px', height: '400px' }} />
      <Bar
        title='Mainstream framework usage'
        xData={['angular', 'vue', 'react']}
        yData={[60, 70, 80]}
        style={{ width: '500px', height: '400px' }} />
    </div>
  )
}

export default Home