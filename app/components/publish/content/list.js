import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import {Popconfirm, message,Icon,Table,Form, Select,Input, Row, Col, Modal, Button,Tag } from 'antd';
const FormItem = Form.Item;

/*import BaseForm from '../common/base-form';*/

var FormSearch = React.createClass({
   getInitialState: function () {
        return {

        };
  },
  search(){
    if(this.props.onSearch){
      this.props.onSearch();
    }
  },

  handleChange(which,val){
    let self = this;

    if(this.props.changeHandle){
      this.props.changeHandle(which,val);
    }
  },
  addPublish(){
    if(this.props.addPublish){
      this.props.addPublish();
    }
  },
  render(){

    let tstatus = this.props.tstatus, taskadminIds = this.props.taskadminIds;
    var taskadminIds_node = '';
    if(taskadminIds.length>0){
      taskadminIds_node = (
        <Col span="3" style={{marginLeft:'10'}}>
           <Select
              defaultValue={this.props.taskadminId+''}
              onChange={this.handleChange.bind(null,'taskadminId')}
              style={{width:'120'}}
           >
              <Option value='-1'>全部管理</Option>
              {
                taskadminIds.map((item,key)=>{
                  return (
                    <Option key={key} value={item.taskadminId+''}>{item.name}</Option>
                  )
                })
              }
            </Select>
        </Col>
      )
    }else{
      taskadminIds_node = '';
    }

    var taskstatus_node = '';
    if(tstatus.length>0){
      taskstatus_node = (
        <Col span="3" style={{marginLeft:'10'}}>
           <Select
              defaultValue={this.props.taskstatus+''}
              onChange={this.handleChange.bind(null,'taskstatus')}
              style={{width:'120'}}
           >
              <Option value='-1'>全部状态</Option>
              {
                tstatus.map((item,key)=>{
                  return (
                    <Option key={key} value={item.taskstatus+''}>{item.status}</Option>
                  )
                })
              }
            </Select>
        </Col>
      )
    }else{
      taskstatus_node = '';
    }

    return (
       <div style={{marginBottom:'20'}}>
          <Row>
            {taskadminIds_node}
            {taskstatus_node}
          </Row>
          <Row className="u-mt-20">
            <Col span="12" style={{ textAlign: 'left' }}>
              <Button type="primary" onClick={this.search}>搜索</Button>
            </Col>
            <Col span="12" style={{ textAlign: 'right' }}>
                <Button type="primary" onClick={this.addPublish}>新增发布</Button>
            </Col>

          </Row>
        </div>
      )
  }
});


var TagIndex = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
        return {
          data: [],
          pagination: { pageSize:20,total:20},
          totalItem: 20,
          loading: false,
          firstLevelTag: [],
          secondLevelTag: [],
          taskadminIds: [],
          tstatus: [],

          taskadminId: -1,
          taskstatus: -1
        };
  },
  handleTableChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    let taskadminId = this.state.taskadminId,
        taskstatus  = this.state.taskstatus;

    let _parmas = {
      taskadminId: +taskadminId,
      taskstatus: taskstatus,
      index: pagination.current
    }

    this.fetch(_parmas);
  },

  fetch(params = {}) {

    let self = this;
    this.setState({ loading: true });

    if(localStorage.getItem('adminId')){
      params.adminId = localStorage.getItem('adminId');
    }

    reqwest({
      url: apiConfig.apiHost+'/cms/publish/list.php',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        let pagination = self.state.pagination;
        pagination.total = result.totalIndex*pagination.pageSize;

        //let firstLevelTag = result.data.firstLevelTag;
        self.setState({
          loading: false,
          data: result.data.task,
          taskadminIds: result.data.taskadminIds,
          tstatus: result.data.tstatus,

          pagination,
          totalItem: result.totalItem
        });
      }
    });
  },
  componentDidMount() {
    this.fetch();
  },
  componentWillReceiveProps(nextprops){
    this.fetch();
  },
  onSearch(){
    let taskadminId = this.state.taskadminId,
        taskstatus  = this.state.taskstatus;

    let _parmas = {
      taskadminId: +taskadminId,
      taskstatus: taskstatus,
      index: 1
    }

    this.fetch(_parmas);
  },
  changeHandle(){
    let which = arguments[0],
        val = arguments[1];
    switch(which){
      case 'taskadminId':
          this.setState({
            taskadminId: val
          })
          break;
      case 'taskstatus':
          this.setState({
            taskstatus: val
          })
          break;
    }

  },
  //新增发布
  addPublish(){
    console.log(this);
    this.context.router.push('/publish/content/edit');
  },
  edit(pid,type){

    if(type=="edit"){
       message.error('该功能暂未开放');
       return;
    }
    this.context.router.push('/publish/content/view/'+pid);
  },
  endHandle(pid){
     let self = this;
     let _data = this.state.data;
     let params = { pid: pid};

      if(localStorage.getItem('adminId')){
        params.adminId = localStorage.getItem('adminId');
      }

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/taskdel.php',
        method: 'post',
        data: params,
        type: 'json',
        success: (res) => {
          if(res.code){
            message.success(res.msg);
            _data.forEach((item)=>{
              if(item.pid==pid){
                item.isDel=0;
                item.status="已终止";
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

  render() {

    let self = this;

    if(this.state.loading){
      return (
        <Icon type="loading" />
      )
    }
    let columns = [{
      title: '发布时间',
      dataIndex: 'ptime'
    },{
      title: '主题内容',
      dataIndex: 'topic'
    },{
      title: '相关频道',
      dataIndex: 'chname'
    },{
      title: '相关标签',
      dataIndex: 'tagname'
    },{
      title: '内容数量',
      dataIndex: 'worksNum'
    },{
      title: '内容曝光',
      dataIndex: 'pageview'
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

        let end_node = '';
        if(+record.isDel==1){
          end_node = (
            <span>
              <span className="ant-divider"></span>
              <a href="javascript:;" onClick={self.endHandle.bind(null,record.pid)}>终止该任务</a>
            </span>
          )
        }
        return (
            <span>
              <a href={'#/publish/content/view/'+record.pid} target="_blank">查看详情</a>
              {end_node}
            </span>
          )
      }
    }];

    let props = {
      onSearch: this.onSearch,
      changeHandle: this.changeHandle,
      addPublish: this.addPublish,
      taskadminIds: this.state.taskadminIds,
      tstatus: this.state.tstatus,
      taskadminId: this.state.taskadminId,
      taskstatus: this.state.taskstatus
    }

    return (
      <div className="right-container">
        <FormSearch {...props}  />
        <Table
          showHeader
          columns={columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          bordered
          rowKey={record => record.pid}
          />
          <span className="total_show">共 {this.state.totalItem} 条记录</span>
      </div>
    );
  }
});

module.exports = TagIndex;
