/**
 * Factory for creating a Text component.
 */
export function createComponentTemplate() {
    return {
        type: 'Text',
        props: {
            text: 'New Text',
            x: 50,
            y: 50,
            colour: '#ffffff'
        }
    };
}