import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import { Popconfirm,Popover,message,Icon,Table,Form, Select,Input, Row, Col, Modal, Button,Tag } from 'antd';
const FormItem = Form.Item;

import TagsMultSelect from '../../common/tags-mult-select';

//缩略图
const TuleImageBox = React.createClass({
  render(){

    let _item = this.props.item;

    return (
      <div>
        <img src={_item} width='480' />
      </div>
    )
  }
})


var ViewPage = React.createClass({
    getInitialState: function () {
        return {
          data: [],
          loading: false,
          pagination: { pageSize:20,total:20},
          totalItem: 20,
          tagids:[],
          record: {},
          visible: false,
        };
    },
    componentDidMount: function () {
      let {params} = this.props;
      console.log(params,'ww');
      this.getSource({pid:params.id});
    },
    componentWillReceiveProps(nextProps) {
       let {params} = nextProps;
      this.getSource({pid:params.id});
    },
    handleTableChange(pagination) {
      let self = this;
      const pager = this.state.pagination;
      pager.current = pagination.current;
      this.setState({
        pagination: pager,
      });

      let {params} = self.props;
      let _parmas = {
        pid:params.id,
        index: pagination.current
      }

      this.getSource(_parmas);
    },
    getSource(params={}){
      let self = this;
      this.setState({ loading: true });

      params = {pid: params.pid,index: params.index||1};

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
            let pagination = self.state.pagination;
            pagination.total = res.totalIndex*pagination.pageSize;
            self.setState({
              data: res.data,
              loading: false,
              pagination,
              totalItem: res.totalItem
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

    // 弹出框
    showModal(record) {
      this.setState({
        visible: true,
        record: record
      });
    },
    handleOk() {

      let {params} = this.props;
      let self = this;
      let record = this.state.record;

      let _tagids = [];
      record.existTags = record.existTags||[];
      record.existTags.forEach((item)=>{
        let _sp = item.split(":");
        _tagids.push(_sp[1]);
      })
      let _arr = this.state.tagids;
      let real_tag = _arr;

      if(_arr.length<=0&&_tagids.length<=0){
        message.error('你还没选择标签哦');
        return;
      }
      if(_arr.length<=0){
        real_tag = _tagids;
      }
      let _parmas={};
      _parmas.tid = record.tid;
      _parmas.tule = [{
        tagids:real_tag
      }];
      if(localStorage.getItem('adminId')){
        _parmas.adminId = localStorage.getItem('adminId');
      }
      reqwest({
        url: apiConfig.apiHost+'/cms/publish/tule.php',
        method: 'post',
        data: _parmas,
        type: 'json',
        success: (result) => {
          if(result.code){

              message.success('编辑成功');

              self.setState({
                visible: false,
                confirmLoading: false
              });
              self.getSource({pid:params.id});

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
    tagChange(key,value){
      console.log(value);
      this.setState({
        tagids: value
      })
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
            <Popover overlay={<TuleImageBox item={record.image} />} title="图片" trigger="hover" placement="rightBottom">
              <img src={record.image} width="60" />
            </Popover>
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
          let hide_node = '' , edit_node='';
          if(+record.isDel==1){
            hide_node = (
                <a href="javascript:;" onClick={self.hideHandle.bind(null,record.id,record.tid)}>屏蔽</a>
              );
          }
          if(+record.isSuperAdmin==1){
            edit_node = (
                <a href="javascript:;" onClick={self.showModal.bind(null,record)}>编辑</a>
              );
          }
          return (
              <span>
                {hide_node}
                <span className="ant-divider"></span>
                {edit_node}
              </span>
            )
        }
      }];

      let formItemLayout = {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
        };

      let record = this.state.record;
      record.existTags = record.existTags||[];

      return (
          <div>
             <Table
              showHeader
              columns={columns}
              dataSource={this.state.data}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}
              bordered
              rowKey={record => record.id}
              />
              <span className="total_show">
                共 {this.state.totalItem} 条记录，
                等待中xx条，发布成功xx条，发布失败xx条，重新发布xx条
              </span>

              <Modal title="编辑标签"
               visible={this.state.visible}
               onOk={this.handleOk}
               confirmLoading={this.state.confirmLoading}
               onCancel={this.handleCancel}>
               <div style={{maxHeight: '450',overflow:'auto'}}>
                <Form horizontal>
                   <FormItem
                     {...formItemLayout}
                     label="标签：">
                     <TagsMultSelect defaultValue={record.existTags} log={''} tagChange={self.tagChange} />
                   </FormItem>
                 </Form>
               </div>
             </Modal>
          </div>
        )
    }
})

module.exports = ViewPage;
