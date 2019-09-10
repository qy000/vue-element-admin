
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: 'http://test.sxhuzhen.com/zhengquan/stockInfo/qureyList',
    type: 'post',
    response: _ => {
      return {
        'msg': '操作成功！',
        'data': {
          'dataList': [
            {
              'stockCode': '111111', // 股票代码
              'stockName': 'test3', // 股票名称
              'startTime': '2018-01-01 01:00:00', // 开始认购时间
              'deadlineTime': '2018-01-01 01:00:00', // 截止认购时间
              'publishTime': '2018-01-01 01:00:00', // 公布中签时间
              'listingTime': '2018-01-01 01:00:00' // 上市时间
            },
            {
              'stockCode': '232122',
              'stockName': 'test6',
              'startTime': '2018-01-01 01:00:00',
              'deadlineTime': '2018-01-01 01:00:00',
              'publishTime': '2018-01-01 01:00:00',
              'listingTime': '2018-01-01 01:00:00'
            },
            {
              'stockCode': '01920',
              'stockName': '恒新丰控股',
              'startTime': '2018-01-01 01:00:00',
              'deadlineTime': '2018-01-01 01:00:00',
              'publishTime': '2018-01-01 01:00:00',
              'listingTime': '2018-01-01 01:00:00'
            }
          ],
          'pageNo': 1,
          'pageSize': 5,
          'total': 3,
          'pages': 1
        },
        'rescode': 200,
        code: 20000
      }
    }
  }
]
