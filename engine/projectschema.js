// ... Existing code ...

let project = {
    projectName: "MyAwesomeApp",
    activeViewId: "view_001",
    fileSystem: {
        id: "root",
        type: "folder",
        name: "MyApp",
        children: [
            {
                id: "view_001",
                type: "file",
                fileType: "SwiftUIView",
                name: "ContentView.swift",
                content: {
                    id: 'root-content-view',
                    type: 'Container',
                    props: {},
                    children: [
                        {
                            id: 'test-button',
                            type: 'Button',
                            props: {
                                text: 'Test Button',
                                x: 50,
                                y: 100,
                                width: 100,
                                height: 40
                            }
                        }
                    ]
                }
            }
        ]
    }
};

// ... Rest of the file unchanged ...