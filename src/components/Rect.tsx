import { KonvaEventObject } from "konva/lib/Node";
import React from "react";
import { Circle, Layer, Rect, Stage, Transformer } from "react-konva";
import { v4 as uuid } from 'uuid';
import { rectangleFill, rectangleOutline } from "../constants/style_constants";
import { ICircle, IRectangle } from "../models/IShapes";

interface RectangleProps {
    shapeProps: IRectangle;
    isSelected: boolean;
    onSelect: any;
    onChange: any;
    removeRect: any;
}

const Rectangle = (rectangleProps: RectangleProps) => {
    const shapeRef = React.useRef<any>();
    const trRef = React.useRef<any>();

    const shapeProps = rectangleProps.shapeProps
    const isSelected = rectangleProps.isSelected
    const onSelect = rectangleProps.onSelect
    const onChange = rectangleProps.onChange
    const removeRect = rectangleProps.removeRect

    const circleProps: ICircle = {
        x: Math.max(shapeProps.x + shapeProps.width, shapeProps.x),
        y: Math.min(shapeProps.y, shapeProps.y + shapeProps.height),
        fill: '#B71C1C',
        visible: true,
        width: 30, height: 30,
        id: shapeProps.id,
    }
    React.useEffect(() => {
        if (isSelected && trRef.current !== undefined) {
            // we need to attach transformer manually
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <Rect
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable
                stroke={rectangleOutline}
                onDragMove={(e) => {
                    onChange({
                        ...shapeProps,
                        x: Math.max(50, e.target.x()),
                        y: Math.max(50, e.target.y()),
                    })
                }}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: Math.max(50, e.target.x()),
                        y: Math.max(50, e.target.y()),
                    });
                }}
                onTransform={(e)=>circleProps.visible=false}
                onTransformEnd={(e) => {
                    // transformer is changing scale of the node
                    // and NOT its width or height
                    // but in the store we have only width and height
                    // to match the data better we will reset scale on transform end
                    const node = shapeRef.current;
                    if (node !== undefined) {
                        const scaleX = node.scaleX();
                        const scaleY = node.scaleY();

                        // we will reset it back
                        node.scaleX(1);
                        node.scaleY(1);
                        onChange({
                            ...shapeProps,
                            x: Math.max(5, node.x()),
                            y: Math.max(5, node.y()),
                            // set minimal value
                            width: Math.max(5, node.width() * scaleX),
                            height: Math.max(5, node.height() * scaleY),
                        });
                        circleProps.visible = true
                    }
                }}
            />
            <Circle
                {...circleProps}
                visible={circleProps.visible}
                onClick={() => removeRect(shapeProps.id)} />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) {
                            return oldBox;
                        }
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};
var initialRectangles: Array<IRectangle> = [
    {
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        fill: rectangleFill,
        id: 'rect1',
    }
];


const DrawRect = () => {
    const [rectangles, setRectangles] = React.useState(initialRectangles);
    const [selectedId, selectShape] = React.useState<string | null>(null);

    const [isDrawing, setIsDrawing] = React.useState<boolean>(false);
    const [newRect, setNewRect] = React.useState<Array<IRectangle>>([])

    const startX = React.useRef<number | null>(null);
    const startY = React.useRef<number | null>(null);

    const checkDeselect = (e: KonvaEventObject<MouseEvent>) => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            setIsDrawing(true);
            const stage = e.target.getStage()
            if (stage !== null) {
                startX.current = stage.getRelativePointerPosition().x;
                startY.current = stage.getRelativePointerPosition().y;
                setNewRect([{ x: startX.current, y: startY.current, width: 0, height: 0, fill: 'gray', id: 'newRect' }])
                selectShape(null);
            }
        }
    };

    const onMouseMove = (nativeEvent: KonvaEventObject<MouseEvent>) => {
        if (!isDrawing) return
        const stage = nativeEvent.target.getStage()
        if (stage !== null) {
            const newMouseX = stage.getRelativePointerPosition().x;
            const newMouseY = stage.getRelativePointerPosition().y;
            if (startX.current && startY.current) {
                setNewRect([{
                    x: startX.current,
                    y: startY.current,
                    width: newMouseX - startX.current,
                    height: newMouseY - startY.current,
                    fill: rectangleFill, id: 'newRect'
                }])
            }
        }

    }

    const removeRect = (id: string) => {
        setRectangles(rectangles.filter((rect) => {
            return rect.id !== id
        }))
    }

    const stopDrawing = (e: any) => {
        setIsDrawing(false)
        if (newRect[0] && (newRect[0].height !== 0 || newRect[0].width !== 0)) {
            newRect[0].id = uuid()
            console.log(newRect[0].id)
            rectangles.push(newRect[0])
        }
        newRect.pop()
    }

    const rectanglesToDraw = [...rectangles, ...newRect];
    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={checkDeselect}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrawing}>
            <Layer>
                {
                    rectanglesToDraw.map((rect, i) => {
                        return (
                            <Rectangle
                                key={i}
                                shapeProps={rect}
                                isSelected={rect.id === selectedId}
                                onSelect={() => {
                                    selectShape(rect.id);
                                }}
                                onChange={(newAttrs: IRectangle) => {
                                    const rects = rectangles.slice();
                                    rects[i] = newAttrs;
                                    setRectangles(rects);
                                }}
                                removeRect={removeRect}
                            />
                        );
                    })}
            </Layer>
        </Stage>
    );
}
export default DrawRect;