import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { Popconfirm,message,Icon,Table,Form, Select,Input, Row, Col, Modal, Button,Tag } from 'antd';
const FormItem = Form.Item;

var ViewPage = React.createClass({
    getInitialState: function () {
        return {
          data: [],
          loading: false
        };
    },
    componentDidMount: function () {
      let {params} = this.props;
      this.getSource(params.id);
    },
    componentWillReceiveProps(nextProps) {
       let {params} = nextProps;
      this.getSource(params.id);
    },
    getSource(id){
       let self = this;
      this.setState({ loading: true });

      let params = {pid: id};

      if(localStorage.getItem('adminId')){
        params.adminId = localStorage.getItem('adminId');
      }

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/detail.php',
        method: 'get',
        data: params,
        type: 'json',
        success: (res) => {
          if(res.code){
            self.setState({
              data: res.data,
              loading: false
            })
          }
        }
      });
    },
    hideHandle(id,tid){
      let self = this;
      let params = { id: id, tid: tid };
      let _data = this.state.data;

      if(localStorage.getItem('adminId')){
        params.adminId = localStorage.getItem('adminId');
      }

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/tuledel.php',
        method: 'post',
        data: params,
        type: 'json',
        success: (res) => {
          if(res.code){
            message.success(res.msg);
            _data.forEach((item)=>{
              if(item.id==id){
                item.isDel=0;
                item.status="已屏蔽";
              }
            })
            self.setState({
              data: _data
            })

          }else{
            message.error(res.msg);
          }
        }
      }); 
    },
    render(){

      let self = this;
      let columns = [{
        title: '图乐ID',
        dataIndex: 'tid'
      },{
        title: '缩略图',
        dataIndex: 'image',
        render(text,record){
          return(
              <img src={record.image} width="60" />
            )
        }
      },{
        title: '内容主题',
        dataIndex: 'topic'
      },{
        title: '频道',
        dataIndex: 'channelName'
      },{
        title: '标签',
        dataIndex: 'tagName'
      },{
        title: '发布用户',
        dataIndex: 'userName'
      },{
        title: '发布时间',
        dataIndex: 'publishTime'
      },{
        title: '状态',
        dataIndex: 'status'
      },{
        title: '操作人',
        dataIndex: 'admin'
      },{
        title: '管理',
        dataIndex: '',
        render(text,record){
          let hide_node = '';
          if(+record.isDel==1){
            hide_node = (
                <a href="javascript:;" onClick={self.hideHandle.bind(null,record.id,record.tid)}>屏蔽</a>
              );
          }
          return (
              <span>
                {hide_node}
              </span>
            )
        }
      }];
    
      return (
          <div>
             <Table 
              showHeader
              columns={columns}
              dataSource={this.state.data}
              pagination={false}
              loading={this.state.loading}
              onChange={this.handleTableChange} 
              bordered
              rowKey={record => record.id}
              />
          </div>
        )
    }
})

module.exports = ViewPage;