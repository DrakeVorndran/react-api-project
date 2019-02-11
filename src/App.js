
import React, { Component } from 'react';

import './App.css';
import Selector from './Selector';
/** 
 * This example illustrates a simple react project 
 * that works with an external API. 
 * 
 * Take note of the comments they point common 
 * problems you will need to solve with React. 
 * 
 * There are two ideas here
 * - Input/Controlled Component Pattern
 * - Conditionally Rendering components 
 * 
 * The project has an input field where a user will
 * input a zip code. It finds weather data for that
 * zip and displays it in a component. 
 * 
 * */

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      inputValue: '',     // Used to hold value entered in the input field
      weatherData: null,  // Used to hold data loaded from the weather API
      tempRange: true,

    }
  }

  handleSubmit(e) {
    e.preventDefault()
    // ! Get your own API key ! 
    const apikey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY
    // Get the zip from the input
    const zip = this.state.inputValue
    // Form an API request URL with the apikey and zip
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${apikey}`
    // Get data from the API with fetch
    fetch(url).then(res => {
      // Handle the response stream as JSON
      return res.json()
    }).then((json) => {
      // If the request was successful assign the data to component state
      this.setState({ weatherData: json })
      // ! This needs better error checking here or at renderWeather() 
      // It's possible to get a valid JSON response that is not weather 
      // data, for example when a bad zip code entered.
    }).catch((err) => {
      // If there is no data 
      this.setState({ weatherData: null }) // Clear the weather data we don't have any to display
      // Print an error to the console. 
      console.log('-- Error fetching --')
      console.log(err.message)
      // You may want to display an error to the screen here. 
    })
  }

  remap(val1, range1, range2) { 
    const X = val1
    const A = range1[0]
    const B = range1[1]
    const C = range2[0]
    const D = range2[1]
    return (X-A)/(B-A) * (D-C) + C
  }

  renderWeather() {
    // This method returns undefined or a JSX component
    if (this.state.weatherData === null ) {
      // If there is no data return undefined
      return null
    }
    else if(this.state.weatherData.cod === "404" || this.state.weatherData.cod === "400") {
      return (
        <p>Invalid Location</p>
      )
    }

    /* 
    This next step needs another level of error checking. It's 
    possible to get a JSON response for an invalid zip in which 
    case the step below fails. 
    */ 
    // Take the weather data apart to more easily populate the component
    const { main, description, icon } = this.state.weatherData.weather[0]
    const { temp, pressure, humidity, temp_min, temp_max } = this.state.weatherData.main 
    const tempf = (temp-273.15) * (9/5) + 32 
    const red = this.remap(tempf,[32,100],[0,255])
    const blue = this.remap(tempf,[100,32],[0,255])
    console.log(red, blue, tempf)
    const styles={
      background: `rgb(${red},${(red+blue)/2},${blue})`
    }
    return (
      <div className="contianer" style={styles}>
        <div>Title: {main}</div>
        <div>Desc: {description}</div>
        <div>Icon: {icon}</div>
        {this.state.tempRange? <div>Temp: {Math.floor((temp-273.15) * (9/5) + 32)}</div> : <div>Temp Min: {Math.floor((temp_min-273.15) * (9/5) + 32)} Max:{Math.floor((temp_max-273.15) * (9/5) + 32)}</div>}
        <div>Pressure: {pressure}</div>
        <div>Humidity: {humidity}</div>
      </div>
    )
  }

  updateTemp() {
    this.setState({tempRange: !this.state.tempRange})
  }

  render() {
    return (
      <div className="App">

        {/** This input uses the controlled component pattern */}
        <form onSubmit={e => this.handleSubmit(e)}>

          {/** 
          This pattern is used for input and other form elements 
          Set the value of the input to a value held in component state
          Set the value held in component state when a change occurs at the input 
          */}
          <input 
            value={this.state.inputValue} 
            onChange={e => this.setState({ inputValue: e.target.value })}
            type="text" 
            pattern="(\d{5}([\-]\d{4})?)"
            placeholder="enter zip"
            htmlFor="submit"
          />

          <button type="submit" className="submit">Submit</button>

        </form>
        <div>
          <Selector text="Tempature as a Range" value={this.state.tempRange} onClick={e => this.updateTemp()} />
        </div>
        {/** Conditionally render this component */}
        {
          this.renderWeather()}
      </div>
    );
  }
}

export default App;
