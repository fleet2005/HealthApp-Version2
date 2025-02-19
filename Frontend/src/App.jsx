import LoginPage from './LoginPage.jsx'
import HomePage from './HomePage.jsx';

//Reason: JSX Differentiation
// Uppercase components (e.g., <LoginPage />) are treated as React components.
// Lowercase elements (e.g., <div>, <span>) are treated as HTML elements

function App()
{
    return (
        <>
            <HomePage/>
            {/* <LoginPage/> */}
        </>
    );
}

export default App;
