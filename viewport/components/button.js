/**
 * Factory for creating a Button component.
 */
export function createComponentTemplate() {
    return {
        type: 'Button',
        props: {
            text: 'New Button',
            x: 50,
            y: 100,
            width: 100,
            height: 40
        }
    };
}