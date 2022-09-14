import 'guh';

function App() {
    // @typescript-eslint/ban-ts-comment
    // @ts-expect-error guh-editor is not in JSX.InstrinsicElements and I have no idea how to fix it
    return <guh-editor />;
}

export default App;
