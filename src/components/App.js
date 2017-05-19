import React, { Component } from 'react';
import { DateRange } from 'react-date-range';
import moment from 'moment';
import { Jumbotron, Container, Row, Col} from 'reactstrap';

class App extends Component {
    constructor(props, context) {

    super(props, context);


    this.state = {

      'rangePicker' : {},
      'linked' : {},
      'datePicker' : null,
      'firstDayOfWeek' : null,
      'predefined' : {},
    } 
    }
 
   componentDidupdate(prevProps, PrevState){
       localStorage.dateData = JSON.stringify(this.state.rangePicker);
    }
    handleChange(which, payload) {

    this.setState({

      [which] : payload

    });

  }
    render(){
        
          const { rangePicker, linked, datePicker, firstDayOfWeek, predefined} = this.state;

    const format = 'YYYYMMDD';
    
        return (
      
        <Container>
         
                <Row>
                    <Col md="2"></Col>
                    <Col md="8">
                    <DateRange 
                    onInit={ this.handleChange.bind(this, 'rangePicker') } 
                    onChange={ this.handleChange.bind(this, 'rangePicker') } 
                    />
                    </Col>
                    <Col md="2"></Col>
                </Row>
       
           
            <div>
                <Row>
                    <Col md = "3"></Col>
                    <Col md = "3">
                    <input
                    id = "date_text"
                    type='text'
                    size = "27"
                    
                    readOnly
                    value={ rangePicker['startDate'] && rangePicker['startDate'].format(format).toString()+' 부터'}
                    />
                    </Col>
                    <Col md = "3"> 
                    <input
                    type='text'
                    size = "27"
                    readOnly
                    value={ rangePicker['endDate'] && rangePicker['endDate'].format(format).toString()+ ' 까지' }
                    />
                    </Col>
                    <Col md = "3"></Col>
                </Row>
                
          </div>
         </Container>
        
        


        )
    }
}
export default App;