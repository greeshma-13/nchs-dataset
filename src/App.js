import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import dataset from './rows.json'
import paginationFactory from 'react-bootstrap-table2-paginator';
import { Dropdown } from 'semantic-ui-react'

class App extends Component  {
  constructor(props) {
    super(props);

    var rows = [];
    var cells;   

    this.state = {
      isLoaded:false,
      rows: rows,
      columns:[],
      dataset:[],
      states:[],
      causes:[],
      state:"",
      cause:""     
    };
    this.handleChange=this.handleChange.bind(this)
  }

  dateFormatter(cell, row)  {
    return <span>{new Date(cell).toDateString()}</span>;
  }

  getUpdateData(state,cause){
    const cols= dataset.meta.view.columns.map(x=>x.name);
        console.log('cols',cols)
        var data=dataset.data.map(x=>{
          // console.log('x',x);
          let row={};
          cols.forEach((col,i) => {
            row[col]=x[i]
          });
          return row;
        })

      if(state)
        data=data.filter(x=> (x.State.toLowerCase()).search(state.toLowerCase())>-1);
        if(cause)
        data=data.filter(x=> ((x["Cause Name"]).toLowerCase()).search(cause.toLowerCase())>-1);
      
        let columns=cols.map(c=>{
          let width="100px";
          if(c=="sid" || c=="id" || c=="Age-adjusted Death Rate" || c=="State" || c=="113 Cause Name" || c=="Cause Name" )
               width="200px"
               if(c=="created_at" || c=="created_meta" || c=="updated_at" || c=="updated_meta")
               width="150px"
               if(c=="created_at" || c=="updated_at")
               return {formatter:this.dateFormatter.bind(this),dataField: c,text: c, sort: true,headerStyle: { width: width }}
               else
               return {dataField: c,text: c, sort: true,headerStyle: { width: width }}
        })
        
        this.setState({
          isLoaded: true,
          columns: columns,
          dataset:data
        });
  }

  filter(){
   console.log('this.state.state,this.state.cause',this.state)
   let state=this.state.state?this.state.state:"";
   let cause=this.state.cause?this.state.cause:""
   this.getUpdateData(state,cause)
  }

  reset(){
   
    let state="";
    let cause=""
    this.setState({
      state,
      cause
    })
    this.getUpdateData(state,cause)
   }

  componentDidMount(){

    fetch("https://jsonplaceholder.typicode.com/todos/1")
    .then(res => res.json())
    .then(
      (result) => {

        const cols= dataset.meta.view.columns.map(x=>x.name);
        console.log('cols',cols)
        var data=dataset.data.map(x=>{
          // console.log('x',x);
          let row={};
          cols.forEach((col,i) => {
            row[col]=x[i]
          });
          return row;
        })

        let states=data.map(x=>x.State);
        let causes=data.map(x=>x['Cause Name']);
        this.setState({
          states:[...new Set(states)],
          causes:[...new Set(causes)]
        });
        
        this.getUpdateData();
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )

  }

  handleChange(e){
    e.preventDefault();
    console.log('e',e.currentTarget,e.target,e.target.value,e.target.name)
    this.state[e.target.name]=e.target.value;
  }

  handleStateDropdownChange = (e, { value }) => this.setState({ state: value })
  handleCauseDropdownChange = (e, { value }) => this.setState({cause: value })

  render(){
    const columns = this.state.columns;
    const products = this.state.dataset;
    const options = {
      showTotal:true,
      sizePerPage: 10,
    };
    console.log('columns',this.state.columns,products)

    const states=this.state.states.map((x,i)=>{return {key:i,text:x,value:x}});
    const causes=this.state.causes.map((x,i)=>{return {key:i,text:x,value:x}});

    if(this.state.isLoaded==false)
    return (<div style={{marginTop:'200px'}} class="ui active centered inline loader"></div>)
else
  return (
    <div className="main">
      {/* <h2 class="main_head ui header">
        NCHS - Leading Causes of Death: United States
  <div class="sub header">This dataset presents the age-adjusted death rates for the leading causes of death.</div>
      </h2> */}
      <div class="ui fluid card" style={{marginTop:'20px'}}>
        <div class="content"><div class="header" style={{color:'#003d71'}}>NCHS - Leading Causes of Death: United States</div></div>
        <div class="content">
          <div class="ui form">
            <div class="equal width fields">
              <div class="field">
                <label style={{color:'#003d71'}}>State</label>
                <div class="ui input">
                  {/* <input name="state" value={this.state.state}
            onChange={this.handleChange} type="text" placeholder="State" /> */}
           
           
           <Dropdown onChange={this.handleStateDropdownChange.bind(this)} placeholder='State' search selection options={states} value={this.state.state} />

            </div>
              </div>
              <div class="field">
                <label style={{color:'#003d71'}}>Cause name</label>
                <div class="ui input">
                <Dropdown onChange={this.handleCauseDropdownChange.bind(this)} placeholder='Cause' search selection options={causes} value={this.state.cause} />
                  {/* <input name="cause" value={this.state.cause}
            onChange={this.handleChange} type="text" placeholder="Cause name" /> */}
            
            </div>
              
             
              </div>
              <div class="field">
                <label></label>
                <button style={{ backgroundColor:'#003d71 !important',marginTop:'20px'}} onClick={this.filter.bind(this)}  class="ui secondary button">Filter</button>
                <button style={{ color: '#003d71 !important','border-color': '#003d71',marginTop:'20px'}} onClick={this.filter.bind(this)} onClick={this.reset.bind(this)} style={{marginTop:'20px'}} color='black' class="ui basic black button">Reset</button>
              </div>
            </div>
          </div>

        <div class="grid-container" style={{width: '100%', height: '400px',overflowX:'scroll'}}>

        <BootstrapTable pagination={ paginationFactory(options) } keyField='id' data={ products } columns={ columns } />
        </div>

        </div>
      </div>

    </div>
  );
  }
}

export default App;
