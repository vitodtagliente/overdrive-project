import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default class Dashboard extends React.Component {    
    constructor(props) {
      super(props);
      this.state = {
      };
    }
  
    componentDidMount() {
        
    }
  
    componentDidUpdate() {
  
    }
  
    render() {
      return (
        <Container>
            <Navbar />
            <Sidebar />
        </Container>
      );
    }
  }