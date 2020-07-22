import React from 'react';
import DataProvider from './DataProvider';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  #dataProvider = new DataProvider('http://localhost:9000/api/items');
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    // fetch the data
    this.#dataProvider.getList().then(res => {
      this.setState({ items: res.data.data });
    }).catch(e => {
      console.log(e);
    });
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <Dashboard />
    );
  }
}

export default App;
