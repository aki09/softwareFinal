import React from 'react';

const NotFound = () => {
  return (
    <div style={{textAlign: 'center'}}>
      <h1 style={{fontSize: '8em', margin: '0'}}>404</h1>
      <p style={{fontSize: '2em', margin: '0'}}>Oops! Page not found.</p>
      <br/>
      <p style={{fontSize: '1.2em'}}>Looks like you've stumbled upon a broken link.</p>
      <p style={{fontSize: '1.2em'}}>Please check the URL or try using our search bar.</p>
    </div>
  );
};

export default NotFound;