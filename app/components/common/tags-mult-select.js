import {Select} from 'antd';
const Option = Select.Option;

var TagsSelect = React.createClass({
    getInitialState: function () {
        return {
         tagList:[],
        };
    },
    componentDidMount: function () {
      let self = this;
      let _parmas = {};

      if(localStorage.getItem('adminId')){
        _parmas.adminId = localStorage.getItem('adminId');
      }

      reqwest({
        url: apiConfig.apiHost+'/cms/publish/taglist.php',
        method: 'post',
        data: _parmas,
        type: 'json',
        success: (res) => {
          if(res.code){
            self.setState({
              tagList: res.data
            })
          }else{
             message.error(result.msg);
          }

        }
      });
    },
    componentWillReceiveProps(nextProps) {

    },
    tagChange(key,value){
      let _value = [];
      value.forEach((item)=>{
        let _sp = item.split(":");
        _value.push(_sp[1]);
      })
      if(this.props.tagChange){
        this.props.tagChange(key,_value);
      }

    },
    render(){

      let self = this;
      let tagList = this.state.tagList;
      let key = this.props.log;

      return (
          <div>
            <Select
               multiple
               placeholder="请选择内容标签"
               style={{ width: '100%' }}
               defaultValue={this.props.defaultValue}
               onChange={self.tagChange.bind(null,key)}
               >
              {
                tagList.map((_item,_key)=>{
                  return(
                    <Option key={_item.name+":"+_item.tagid}>{_item.name}</Option>
                  )
                })
              }
            </Select>
          </div>
        )
    }
})

module.exports = TagsSelect;
