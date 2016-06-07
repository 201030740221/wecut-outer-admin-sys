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

    return (
       <div style={{marginBottom:'20'}}>
          <Row>
            <Col span="10">
              <div span="12" className='fl'>
               <Select
                  defaultValue="-1"
                  onChange={this.handleChange.bind(null,'search_type')}
                  style={{width:'120'}}
                  >
                  <Option value="-1">用户昵称</Option>
                  <Option value="1">频道名</Option>
                  <Option value="2">频道ID</Option>
                  <Option value="3">频道主ID</Option>
                </Select>
              </div>
              <div span="12" className='fl'>
                <Input className="search_input" placeholder="please enter..." style={{marginLeft:'10'}} />
              </div>
            </Col>
            <Col span="3" style={{marginLeft:'10'}}>
               <Select
                  defaultValue="-1"
                  onChange={this.handleChange.bind(null,'search_channel')}
                  style={{width:'120'}}
               >
                  <Option value="-1">全部频道</Option>
                  <Option value="1">推荐频道</Option>
                  <Option value="0">非推荐频道</Option>
                </Select>
            </Col>
            <Col span="3" style={{marginLeft:'10'}}>
               <Select
                  className="search_channel"
                  defaultValue="-1"
                  onChange={this.handleChange.bind(null,'has_tag')}
                  style={{width:'120'}}
               >
                  <Option value="-1">全部标签</Option>
                  <Option value="1">有标签</Option>
                  <Option value="0">无标签</Option>
                </Select>
            </Col>
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

          searchtype: -1,
          isrec: -1,
          tagid:-1,
          istag: -1,

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

    let _val = $('.search_input').val();
    let searchtype = this.state.searchtype,
        searchtext = _val,
        isrec  = this.state.isrec ,
        tagid = this.state.tagid,
        istag = this.state.istag;
    let _parmas = {
      searchtype: +searchtype,
      searchtext: searchtext||null,
      isrec: +isrec,
      tagid: +tagid,
      istag: +istag,
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
        if(result.data.length>0){
           self.setState({
            loading: false,
            data: result.data,
            pagination,
            totalItem: result.totalItem
          });
        }else{
          self.setState({
            loading: false
          });
        }

      }
    });
  },
  componentDidMount() {
    this.fetch();
  },
  onSearch(){
    let _val = $('.search_input').val();
    let searchtype = this.state.searchtype,
        searchtext = _val,
        isrec  = this.state.isrec ,
        tagid = this.state.tagid,
        istag = this.state.istag;
    let _parmas = {
      searchtype: +searchtype,
      searchtext: searchtext||null,
      isrec: +isrec,
      tagid: +tagid,
      istag: +istag
    }
    this.fetch(_parmas);
  },
  changeHandle(){
    let which = arguments[0],
        val = arguments[1];
    switch(which){
      case 'search_type':
          this.setState({
            searchtype: val
          })
          break;
      case 'search_channel':
          this.setState({
            isrec: val
          })
          break;
      case 'tag_type':
          this.setState({
            tagid: val
          })
          break;
      case 'has_tag':
          this.setState({
            istag: val
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

    return (
      <div className="right-container">
        <FormSearch
          onSearch={this.onSearch}
          changeHandle={this.changeHandle}
          addPublish={this.addPublish}
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
