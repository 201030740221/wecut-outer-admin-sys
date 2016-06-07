'use strict';

import React from 'react';
import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import ReactDOM from 'react-dom';
import { createHashHistory } from 'history';
const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

import 'antd/style/index.less';
import './css/style';

import App from './views/Main';

import LoginPage from './components/user/login';

//发布管理
import PublishContentList from './components/publish/content/list';
import PublishContentEdit from './components/publish/content/edit';
import PublishContentView from './components/publish/content/view';

//发布账号管理
import PublishAccountList from './components/publish/account/list';
import PublishAccountEdit from './components/publish/account/edit';


// 登录验证
function requireAuth() {
  if (!localStorage.getItem('adminId')) {
    location.hash = '/user/login';
    return false;
  }
}


var routes = (
  <Router history={appHistory}>

  	  {/* 用户管理 */}
      <Route path="user">
        	<Route component={LoginPage} path="login" breadcrumbName="登录"/>
      </Route>

      <Route onEnter={requireAuth} component={App} path="/" >

	         {/* 发布管理 */}
	        <Route onEnter={requireAuth} path="publish" breadcrumbName="发布管理">
            <Route onEnter={requireAuth} path="content" breadcrumbName="发布">
               <IndexRoute component={PublishContentList}/>
                <Route onEnter={requireAuth} component={PublishContentList} path="list" breadcrumbName="内容"/>
                <Route onEnter={requireAuth} component={PublishContentEdit} path="edit" breadcrumbName="编辑" />
                <Route onEnter={requireAuth} component={PublishContentView} path="view/:id" breadcrumbName="详情" />
            </Route>
	        </Route>

           {/* 发布账号管理 */}
          <Route onEnter={requireAuth} path="publish" breadcrumbName="发布账号管理">
            <IndexRoute component={PublishAccountList}/>
            <Route onEnter={requireAuth} component={PublishAccountList} path="account/list" breadcrumbName="账号列表"/>
            <Route onEnter={requireAuth} component={PublishAccountEdit} path="account/edit/:id" breadcrumbName="账号编辑"/>
          </Route>

      </Route>
  </Router>
);

ReactDOM.render(routes, document.getElementById('app-root'));
