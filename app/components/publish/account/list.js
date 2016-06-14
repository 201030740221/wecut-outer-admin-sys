import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { Upload,Transfer,message,Icon,Table,Form, Select,Input, Row, Col, Modal, Button,Tag } from 'antd';
const FormItem = Form.Item;

//import BaseForm from '../../common/base-form';
import TagsMultSelect from '../../common/tags-mult-select';


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

    let taskadminIds = this.props.taskadminIds;
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
                    <Option key={key} value={item.accountdminId+''}>{item.name}</Option>
                  )
                })
              }
            </Select>
        </Col>
      )
    }else{
      taskadminIds_node = '';
    }

    return (
       <div style={{marginBottom:'20'}}>
          <Row>
            {taskadminIds_node}
          </Row>
          <Row className="u-mt-20">
            <Col span="12" style={{ textAlign: 'left' }}>
                <Button type="primary" onClick={this.addPublish}>新增账号</Button>
            </Col>
            <Col span="12" style={{ textAlign: 'right' }}>
              <Button type="primary" onClick={this.search}>搜索</Button>
            </Col>
          </Row>
        </div>
      )
  }
});

window.count = 0;

var Uploader = React.createClass({
   getInitialState() {
    return {
      fileList: []
    };
  },
  handleChange(info) {

    let fileList = info.fileList;

    // 1. 上传列表数量的限制
    //    只显示最近上传的一个，旧的会被新的顶掉
    fileList = fileList.slice(-10);
    console.log(fileList,'33');

    // 2. 读取远程路径并显示链接
    fileList = fileList.map((file,key) => {
      if (file.response) {
        let _response = file.response;
        // 组件会将 file.url 作为链接进行展示
        file.url = _response.data.picUrl;
        file.uid = _response.data.id||key;
        file.thumbUrl = _response.data.picUrl;
      }
      return file;
    });

    // 3. 按照服务器返回信息筛选成功上传的文件
   /* fileList = fileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });*/

    if(this.props.onUploaderChange){
      this.props.onUploaderChange(fileList);
    }

    this.setState({ fileList:fileList });

  },
  handleBeforeUpload(info){
    console.log(info,'before');
    if(info){
      count++;
    }
    if(count>=10){
      info.status = 'error';
      message.warn('一次上传不能超过10张');
      return;
    }
  },
  tagChange(key,value){
    if(this.props.tagChange){
      this.props.tagChange(key,value);
    }
  },
  delHandle(key){
    if(this.props.delHandle){
      this.props.delHandle(key);
    }
  },
  render() {

    let _adminId = '';
    if(localStorage.getItem('adminId')){
      _adminId = localStorage.getItem('adminId');
    }
    const props = {
      action: apiConfig.apiHost+'/cms/publish/upload.php',
      data: {adminId:_adminId},
      onChange: this.handleChange,
      beforeUpload: this.handleBeforeUpload,
      multiple: true,
      listType: 'picture-card'
    };

    let self = this;
    let fileList = this.state.fileList;
    let formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };

    return (
      <Row className="account_header">
        <Col span="6">
          <Upload {...props} fileList={fileList}>
              <Icon type="plus" />
              <div className="ant-upload-text">上传用户头像</div>
          </Upload>
        </Col>
        <Col span="18">
        {
          fileList.map((item,key)=>{
            let log=key;
            let del_node = (
                <div className="del_btn" onClick={self.delHandle.bind(null,key)}>删除</div>
            ) ;
            if(key==0){
              del_node = '';
            }
            return(
              <div key={key}>
                <Row className="border_bottom">

                  <Col span="21">
                  <Form horizontal>
                    <FormItem
                       {...formItemLayout}
                       label="用户昵称：">
                       <Input id={"uname_"+key} type="text" placeholder="请输入用户昵称" />
                     </FormItem>
                      <FormItem
                       {...formItemLayout}
                       label="用户简介：">
                       <Input id={"sintro_"+key} type="textarea" placeholder="请输入用户简介" />
                     </FormItem>
                     <FormItem
                       {...formItemLayout}
                       label="标签：">
                       <TagsMultSelect log={log} tagChange={self.tagChange} />
                     </FormItem>
                    </Form>
                  </Col>
                  <Col span="3">
                    <div>
                      <span>{key+1}</span>
                    </div>
                    {del_node}
                  </Col>
                </Row>
              </div>
            )
          })
        }
        </Col>

      </Row>
    );
  }
});


var TagIndex = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  getInitialState: function () {
        return {
          data: [],
          pagination: { pageSize:20, showQuickJumper:true ,totalItem:null},
          loading: false,
          fileList:[],
          firstLevelTag: [],
          secondLevelTag: [],

          taskadminIds: [],
          taskadminId: -1,

          record: {},
          visible: false,

          accountList: []
        };
  },
  handleTableChange(pagination) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });

    let taskadminId = this.state.taskadminId;

    let _parmas = {
      accountadminId: taskadminId,
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
      url: apiConfig.apiHost+'/cms/publish/accountlist.php',
      method: 'get',
      data: params,
      type: 'json',
      success: (result) => {
        const pagination = self.state.pagination;
        pagination.total = result.totalIndex*pagination.pageSize;

        //let firstLevelTag = result.data.firstLevelTag;
        let _arr = result.data;
         self.setState({
          loading: false,
          data: result.data.accounts,
          taskadminIds: result.data.accountadminIds,
          pagination,
          totalItem: result.totalItem
        });

      }
    });
  },
  componentDidMount() {
    this.fetch();
  },
  onSearch(){
    let taskadminId = this.state.taskadminId;

    let _parmas = {
      accountadminId: taskadminId,
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
    }

  },
  tagChange(_key,value){
    let accountList = this.state.accountList;
    accountList.forEach((item,key)=>{
      if(_key==key){
        item.tagid = value
      }
    })
    this.setState({
      accountList: accountList
    })
  },

  // 弹出框
  showModal(record) {
    this.setState({
      visible: true,
      record: record
    });
  },
  handleOk() {
    let self = this;
    console.log(this.state.record);
     /*if(!mobile){
      message.warn('手机号码不能为空');
      return;
    }else{
      if(!/^1[34578][0-9]{9}$/i.test(mobile)){
         message.warn('手机号码格式错误');
         return;
      }
    }*/
    let _parmas={};
    let accountList = this.state.accountList;
    let log = false;
    accountList.forEach((_item,_key)=>{
      _item.uname = $('#uname_'+_key).val();
      _item.sintro = $('#sintro_'+_key).val();
       if(!_item.uname){
        message.warn('用户昵称不能为空');
        log = true;
      }
    })
    if(log){
      return;
    }

    let _account = [];
    accountList.forEach((_item,_key)=>{
      _account.push({
        avatar: _item.url,
        uname: _item.uname,
        sintro: _item.sintro,
        tagid: _item.tagid||1
      });
    })

    _parmas.users = _account;
    if(localStorage.getItem('adminId')){
      _parmas.adminId = localStorage.getItem('adminId');
    }
    reqwest({
      url: apiConfig.apiHost+'/cms/publish/accountadd.php',
      method: 'post',
      data: _parmas,
      type: 'json',
      success: (result) => {
        if(result.code){

            message.success('新增成功');

            self.setState({
              visible: false,
              confirmLoading: false
            });
            self.fetch();


        }else{
           message.error(result.msg);
           self.setState({
              confirmLoading: false
            });
        }

      }
    });

  },
  handleCancel() {
    console.log('点击了取消');
    this.setState({
      visible: false
    });
  },
  onUploaderChange(fileList){
    console.log(fileList);
    this.setState({
      accountList: fileList
    })
    console.log(66);
  },


  //新增发布
  addPublish(){
    //this.context.router.push('/publish/account/edit');
    this.showModal({});
  },
  edit(uid){
    this.context.router.push('/publish/account/edit/'+uid);
  },

  addAccount(){
    let accountList = this.state.accountList;
    if(accountList.length>=10){
      message.warn('新增用户不能超过10个');
      return;
    }
    accountList.push({uname:''});
    this.setState({
      accountList: accountList
    });

  },
  delHandle(_key){
    let accountList = this.state.accountList;
    accountList.splice(_key,1);
    this.setState({
      accountList: accountList
    })
  },

  render() {

    let self = this;

    if(this.state.loading){
      return (
        <Icon type="loading" />
      )
    }

    let columns = [{
      title: '用户ID',
      dataIndex: 'uid'
    },{
      title: '昵称',
      dataIndex: 'uname'
    },{
      title: '内容数',
      dataIndex: 'worksNum'
    },{
      title: '标签',
      dataIndex: 'tag'
    },{
      title: '账号质量',
      dataIndex: 'quality'
    },{
      title: '创建时间',
      dataIndex: 'ctime'
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
        return (
            <a href="javascript:;" onClick={self.edit.bind(null,record.uid)}>编辑</a>
          )
      }
    }];

    let props = {
      onSearch: this.onSearch,
      changeHandle: this.changeHandle,
      addPublish: this.addPublish,
      taskadminIds: this.state.taskadminIds,
      taskadminId: this.state.taskadminId,
    }

    return (
      <div className="right-container">
        <FormSearch
          {...props}
        />
        <Table
          showHeader
          columns={columns}
          dataSource={this.state.data}
          pagination={this.state.pagination}
          loading={this.state.loading}
          onChange={this.handleTableChange}
          bordered
          rowKey={record => record.uid}
          />
          <span className="total_show">共 {this.state.totalItem} 条记录</span>

           <Modal title="新增账号"
            visible={this.state.visible}
            onOk={this.handleOk}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}>
            <div style={{maxHeight: '450',overflow:'auto'}}>
              <Uploader
                onUploaderChange={self.onUploaderChange}
                tagChange={self.tagChange}
                delHandle={self.delHandle}
                />
            </div>
          </Modal>
      </div>
    );
  }
});

module.exports = TagIndex;
