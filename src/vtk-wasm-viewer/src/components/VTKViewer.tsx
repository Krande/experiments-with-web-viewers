import '@kitware/vtk.js/favicon';

// Load the rendering pieces we want to use (for both WebGL and WebGPU)
import '@kitware/vtk.js/Rendering/Misc/RenderingAPIs';
import '@kitware/vtk.js/Rendering/Profiles/Volume';

import React, {useEffect, useRef, useState} from 'react';
import '@kitware/vtk.js/Rendering/Profiles/Geometry';
import vtkActor from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper from '@kitware/vtk.js/Rendering/Core/Mapper';
// This is for File objects.  Use readPolyDataArrayBuffer for ArrayBuffer's
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";


const VTKViewer: React.FC = () => {
        const vtkContainerRef = useRef<HTMLDivElement | null>(null);
        const vtkContext = useRef<any | null>(null);
        const [fileContent, setFileContent] = useState<string | null>(null);

        useEffect(() => {
            if (!vtkContainerRef.current || vtkContext.current) {
                return;
            }

            const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
                container: vtkContainerRef.current,
                controllerVisibility: true,
            });
            const renderer = fullScreenRenderer.getRenderer();
            const renderWindow = fullScreenRenderer.getRenderWindow();
            // Fetch the file from the public directory and read it as a string
            fetch('/eigen.vtu')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch the file');
                    }
                    return response.text(); // Read the file content as a string
                })
                .then((data) => {
                    console.log('VTU file content:', data);
                    setFileContent(data); // Save the file content to state
                })
                .catch((error) => {
                    console.error('Error loading the file:', error);
                });
        }, []);
        useEffect(() => {
            if (fileContent === null || !vtkContainerRef.current || vtkContext.current) {
                return;
            }

            // Set up the VTK rendering context
            const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
                container: vtkContainerRef.current,
                controllerVisibility: true,
            });
            const renderer = fullScreenRenderer.getRenderer();
            const renderWindow = fullScreenRenderer.getRenderWindow();

            const reader = vtkXMLPolyDataReader.newInstance();
            const mapper = vtkMapper.newInstance();
            const actor = vtkActor.newInstance();
            actor.setMapper(mapper);

            renderer.addActor(actor);

            // Convert the file content to ArrayBuffer and parse it
            const meshXmlBuffer = new TextEncoder().encode(fileContent).buffer;
            reader.parseAsArrayBuffer(meshXmlBuffer);
            mapper.setInputConnection(reader.getOutputPort());

            renderer.resetCamera();
            renderWindow.render();

            vtkContext.current = {
                fullScreenRenderer,
                renderer,
                renderWindow,
                reader,
                actor,
                mapper,
            };

            return () => {
                if (vtkContext.current) {
                    const {fullScreenRenderer, actor, mapper, reader} = vtkContext.current;
                    actor.delete();
                    mapper.delete();
                    reader.delete();
                    fullScreenRenderer.delete();
                    vtkContext.current = null;
                }
            };
        }, [fileContent]);


        return (
            <div className="h-full w-full bg-gray-100">
                <div ref={vtkContainerRef} className="h-full w-full"></div>
            </div>
        );
    }
;

export default VTKViewer;
