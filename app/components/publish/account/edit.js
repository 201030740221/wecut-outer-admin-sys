import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
import {
  Menu, Dropdown,Popover, message,DatePicker,Radio,InputNumber,
  Icon,Table, Tag, Form, Select, Upload,
  Input, Row, Col, Modal, Button,Pagination ,Transfer} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const createForm = Form.create;
import TagsMultSelect from '../../common/tags-mult-select';

var AccontEdit = React.createClass({
    contextTypes: {
      router: React.PropTypes.object.isRequired
    },
    getInitialState: function () {
        return {
         data:{},
         tagids: [],
         fileList: [],
         loading: true
        };
    },
    componentDidMount: function () {
      let {params} = this.props;
      this.getDetail(params.id);
    },
    componentWillReceiveProps(nextProps) {
      let {params} = nextProps;
      this.getDetail(params.id);
    },
    getDetail(uid){
      let self = this;
      let _parmas = {uid: uid};

      if(localStorage.getItem('adminId')){
        _parmas.adminId = localStorage.getItem('adminId');
      }

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/user.php',
        method: 'get',
        data: _parmas,
        type: 'json',
        success: (res) => {
          if(res.code){
            self.setState({
              data: res.data,
              loading: false,
              fileList: [
                {
                   uid: -1,
                   status: 'done',
                   url: res.data.avatar
                }
              ]
            })
          }else{
             message.error(result.msg);
          }

        }
      });
    },

    handleChange(info) {

      let fileList = info.fileList;

      // 1. 上传列表数量的限制
      //    只显示最近上传的一个，旧的会被新的顶掉
      fileList = fileList.slice(-1);
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

    },

    handleSubmit(e) {

      let self = this;
      let {params} = this.props;
      let _parmas = {uid: params.id};

      if(localStorage.getItem('adminId')){
        _parmas.adminId = localStorage.getItem('adminId');
      }

      let fileList = this.state.fileList;
      let data = this.state.data;

      let _tagids = [];
      data.tagnames = data.tagnames||[];
      data.tagnames.forEach((item)=>{
        let _sp = item.split(":");
        _tagids.push(_sp[1]);
      })
      console.log(_tagids);

      let _arr = this.state.tagids;
      let real_tag = _arr;
      if(_arr.length<=0){
        real_tag = _tagids;
      }

      _parmas.user = [{
        uname: data.uname,
        avatar: fileList[0].url||data.avatar,
        sintro: data.sintro,
        tagids: real_tag
      }];

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/user.php',
        method: 'post',
        data: _parmas,
        type: 'json',
        success: (res) => {
          if(res.code){
              message.success(res.msg);
              setTimeout(function(){
                self.context.router.push('/publish/account/list');
              },1000)
          }else{
             message.error(res.msg);
          }

        }
      });
    },
    onChangeHandle(name,e){
      let data = this.state.data;
      data[name] = e.target.value;

      this.setState({
        data: data
      })

    },
    tagChange(key,value){
      console.log(key,value);
      this.setState({
        tagids: value
      })
    },

    render(){

      if(this.state.loading){
        return (
          <Icon type="loading" />
        )
      }

      let self = this;
      let data = this.state.data;

      let formItemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 14 },
      };

      let _adminId = '';
      if(localStorage.getItem('adminId')){
        _adminId = localStorage.getItem('adminId');
      }
      let props = {
        action: apiConfig.apiHost+'/cms/publish/upload.php',
        data: {adminId:_adminId},
        onChange: this.handleChange,
        beforeUpload: this.handleBeforeUpload,
        multiple: false,
        listType: 'picture-card'
      };
      let fileList = this.state.fileList;


      return (
          <div>
            <Form horizontal form={this.props.form}>
              <h3 className="panel-heading u-mb-20">基本信息</h3>
              <FormItem
                {...formItemLayout}
                label="用户昵称：">
                <Input
                  value={data.uname}
                  type="text"
                  rows="4"
                  onChange={this.onChangeHandle.bind(null,'uname')}
                  />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="用户简介：">
                <Input
                  value={data.sintro}
                  type="textarea"
                  rows="4"
                  onChange={this.onChangeHandle.bind(null,'sintro')}
                  />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="标签：">
                 <TagsMultSelect defaultValue={data.tagnames} log={''} tagChange={self.tagChange} />
              </FormItem>

               <FormItem
                {...formItemLayout}
                label="用户头像：">
                <div>
                  <Upload {...props} fileList={fileList}>
                      <Icon type="plus" />
                      <div className="ant-upload-text">修改用户头像</div>
                  </Upload>
                </div>
              </FormItem>

              <h3 className="panel-heading u-mb-20">提交</h3>
              <FormItem
                wrapperCol={{ span: 12, offset: 4}} >
                <Button type="primary" onClick={this.handleSubmit}>确定</Button>

              </FormItem>
            </Form>
          </div>
        )
    }
})

module.exports = AccontEdit;
