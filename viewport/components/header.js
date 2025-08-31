/**
 * Factory for creating a Header component.
 */
export function createComponentTemplate() {
    return {
        type: 'Header',
        props: {
            text: 'New Header',
            x: 0,
            y: 0,
            width: 340,
            height: 60,
            colour: '#ffffff',
            backgroundColour: '#333'
        }
    };
}