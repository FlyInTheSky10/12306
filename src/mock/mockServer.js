import Mock from 'mockjs'
import data from './data.json'

Mock.mock('/api/train', {
  code: 0,
  trains: data,
})