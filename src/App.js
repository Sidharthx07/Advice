import React from 'react';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  state = {
    advice: 'Loading advice...', 
    isLoading: false,
  };

  _isMounted = false; // Correct way to track mounting

  componentDidMount() {
    this._isMounted = true;
    this.fetchAdvice();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchAdvice = async () => {
    if (this.state.isLoading) return; // Prevent multiple clicks

    this.setState({ isLoading: true });

    let lastError = null;

    for (let retryCount = 3; retryCount > 0; retryCount--) {
      try {
        const response = await axios.get('https://api.adviceslip.com/advice');
        
        if (this._isMounted) {
          this.setState({ advice: response.data.slip.advice, isLoading: false });
        }
        return; // Exit function after successful API call
      } catch (error) {
        lastError = error;
        console.error(`Attempt failed, ${retryCount - 1} retries left.`, error);
      }
    }

    if (this._isMounted) {
      this.setState({ advice: "Oops! Couldn't fetch advice. Try again!", isLoading: false });
    }
  };

  render() {
    return (
      <div className="app">
        <div className="card">
          <h1 className="heading">{this.state.isLoading ? 'Fetching advice...' : this.state.advice}</h1>
          <button 
            className="button" 
            onClick={this.fetchAdvice} 
            aria-label="Get Advice"
            disabled={this.state.isLoading} 
          >
            <span>{this.state.isLoading ? 'LOADING...' : 'GIVE ME ADVICE!'}</span>
          </button>
          {/* Footer Section */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} Advice App | Made by Sidharth ❤️</p>
        </footer>
      </div>
        </div>

        
    );
  }
}

export default App;
