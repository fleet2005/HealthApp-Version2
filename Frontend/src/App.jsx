import LoginPage from './LoginPage.jsx'

//Reason: JSX Differentiation
// Uppercase components (e.g., <LoginPage />) are treated as React components.
// Lowercase elements (e.g., <div>, <span>) are treated as HTML elements

function App()
{
    return (
        <>
            <LoginPage/>
        </>
    );
}

export default App;
