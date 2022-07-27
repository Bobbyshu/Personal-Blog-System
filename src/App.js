import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom'
import { history } from './utils/history'
import Layout from './pages/Layout'
// import { Button } from 'antd'
import Login from './pages/Login'
import './App.css'
import { AuthComponent } from '@/components/AuthComponent'
import Publish from './pages/Publish'
import Article from './pages/Article'
import Home from './pages/Home'

function App () {
  return (
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          <Route path='/' element={
            <AuthComponent>
              <Layout />
            </AuthComponent>
          }>
            <Route index element={<Home />}></Route>
            <Route path='article' index element={<Article />}></Route>
            <Route path='publish' index element={<Publish />}></Route>
          </Route>
          <Route path='/login' element={<Login />}></Route>
        </Routes>
      </div>
    </HistoryRouter>
  )
}

export default App
